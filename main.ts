import * as core from '@actions/core';
import { context } from '@actions/github';
import { Octokit } from '@octokit/rest';
import { runGitHubActionScript } from './bake-time';

async function run() {
  try {
    const delayHours = parseFloat(core.getInput('delay-hours', { required: true }));
    const checkName = core.getInput('check-name', { required: true });

    const octokit = new Octokit();
    
    const context = JSON.parse(core.getInput('context', { required: true }));

    await runGitHubActionScript(octokit, context, { delayHours, checkName });
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
