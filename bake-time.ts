import { Octokit } from "@octokit/rest";
import { context } from '@actions/github';

interface ScriptInputs {
  delayHours: number;
  checkName: string;
}

export async function runGitHubActionScript(octokit: Octokit, context: any, inputs: ScriptInputs): Promise<void> {
    const delayHours = inputs.delayHours;
    const millisInAnHour = 60 * 60 * 1000;
    const delayMilliseconds = delayHours * millisInAnHour;

    if (context.event_name == 'pull_request') {
      throw new Error(`This pull request will be delayed ${inputs.delayHours} hours until the bake time is over`);
    }

    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'open',
    });

    const now = new Date();
    for (const pr of pullRequests) {
      const updatedAt = new Date(pr.updated_at);

      const { data: checkRuns } = await octokit.rest.checks.listForRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: pr.head.sha
      });

      const bakeTimeCheckRun = checkRuns.check_runs.filter(run => run.name === '${{ inputs.check-name }}')[0];
      if (!bakeTimeCheckRun) {
        console.log(`No check named '${inputs.checkName}' for PR #${pr.number}.`);
        for (const run of checkRuns.check_runs) {
          console.log(`Found ${run.id} named ${run.name} with status ${run.status} for PR #${pr.number}.`)
        }
        continue;
      }

      if (bakeTimeCheckRun.conclusion === "success") {
        console.log(`PR #${pr.number} has been marked as completed.`);
        continue;
      }

      // Check if the pull request has not been updated in the specified delay
      const timeSinceStartedMillis = now.getTime() - updatedAt.getTime();
      if (timeSinceStartedMillis >= delayMilliseconds) {
        console.log(`Marking status check as successful for PR #${pr.number}.`);

        const { data: checkUpdate } = await octokit.rest.checks.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          check_run_id: bakeTimeCheckRun.id,
          status: 'completed',
          conclusion: 'success',
          output: {
            title: 'The bake time delay has passed. This PR can be merged.',
            summary: 'The required delay is over, and the check has passed'
          }
        });
        console.log(`Check marked as successful for PR #${pr.number}.`);
        console.log(`Detailed check update message ${JSON.stringify(checkUpdate, undefined, 3)}`);
      } else {
        // Logging for pull requests that are still waiting
        const timeRemaining = (delayMilliseconds - timeSinceStartedMillis) / (millisInAnHour);
        console.log(`Updating pending status check for PR #${pr.number}.`);

        const updateMessage = `${Math.max(timeRemaining, 1).toFixed(0)} hours remain.`;
        const { data: checkUpdate } = await octokit.rest.checks.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          check_run_id: bakeTimeCheckRun.id,
          status: 'in_progress', // This value cannot be modified once completed, leaving it in if GitHub's APIs support it in the future
          conclusion: 'failure',
          output: {
            title: updateMessage,
            summary: 'This check will pass once the delay is over.'
          }
        });

        console.log(`PR #${pr.number} needs to wait for ${timeRemaining.toFixed(2)} hours before the delay is over.`);
        console.log(`Detailed check update message ${JSON.stringify(checkUpdate, undefined, 3)}`);
      }
    }
}