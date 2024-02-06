# bake-time
Github actions to add a bake time check / finish pull requests that have fully baked

```yaml
inputs:
  delay-hours:
    description: How many hours before pull requests have finished baking
    default: 24
    required: false
  ignore-non-push-updates:
    description: Controls if the bake timer uses the last update to the PR like approvals or the just the date of the merge commit GitHub creates to calculate the remaining time
    default: "false"
    required: false
  check-name:
    description: The name of the check that is used to block baking pull requests, recommend "Baking pull request..."
    required: true
```

## Usage:

```yaml
on:
  pull_request:
    types:
      - opened
      - synchronize
  workflow_dispatch:
  schedule:
    - cron: '0 */1 * * *' # Runs every 1 hour 
...
jobs:
  baking_pull_request:
    name: "Baking pull request..."
    runs-on: ubuntu-latest
    steps:
    - uses: peternied/bake-time@v3.3
      with:
        check-name: "Baking pull request..."
        delay-hours: 48
```

## Example:

### Pull request baking start
![Bake time / Baking pull request... (pull_request)](https://user-images.githubusercontent.com/2754967/226928503-4cd6c95f-80fe-4a33-8eeb-37147e18cd29.png)

### Update while baking
![Bake time / Baking pull request... (pull_request) Failing after 3s — 2 hours remain.](https://user-images.githubusercontent.com/2754967/226933188-383f284b-2cb7-4204-ba21-e17475e31a6d.png)

### Baking completed
![Bake time / Baking pull request... (pull_request) Successful in 5s — The bake time delay has passe](https://user-images.githubusercontent.com/2754967/226927082-66ddea37-476a-4e9e-bc4a-53129ee6156f.png)



# Changelog

## v3.2
- Add option to ignore non-push updates to PRs, contributor by @ngehrsitz

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
