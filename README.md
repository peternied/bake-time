# bake-time

> [!WARNING]
> This action has been decommissioned and should be removed from all workflows.
>
> Its implementation depended on updating an Actions-created check run from a later workflow run using `GITHUB_TOKEN`. GitHub no longer allows that workflow design, so this action can no longer complete its bake-time check correctly.

This repository is kept only to document the decommissioned action.

```yaml
inputs:
  delay-hours:
    description: How many hours before pull requests have finished baking
    default: 24
    required: false
  ignore-non-push-updates:
    description: Controls if the bake timer uses the last update to the PR like approvals or the just the date of the merge commit GitHub creates to calculate the remaining time
    default: "true"
    required: false
  check-name:
    description: The name of the check that is used to block baking pull requests, recommend "Baking pull request..."
    required: true
```

## Status

- Decommissioned
- Not recommended for new or existing workflows
- Current action behavior is an immediate failure with a deprecation message



# Changelog

After each `v3.x` release, move the floating `v3` tag to the same commit as the new version tag.

## v3.5
- Decommission the action because GitHub no longer allows this check-run update workflow design
- Replace the implementation with an immediate deprecation failure message

## v3.4
- Pin `actions/github-script` to a full commit SHA for improved action supply-chain safety, contributor @gaiksaya
- Set `ignore-non-push-updates` default to `true` in `action.yml` and docs

## v3.3
- Add option to ignore non-push updates to PRs, contributor @ngehrsitz

## v3.2
- Option to ignore non-push modifications to the pull request, contributor @ngehrsitz

## v3.1
- Process multiple checks with matching name, contributor @ngehrsitz

## v3
- Baking pull requests will be updated with a message about how time remains. 

## v2
- Combined into a single step where the trigger determines the behavior
- Stopped using write operations during the 'pull_request' trigger, by default no write permissions are allowed [[link]](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)

## v1
- Initial Release
