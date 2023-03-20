# bake-time
Github actions to add a bake time check / finish pull requests that have fully baked

```yaml
inputs:
  delay-hours:
    description: How many hours before pull requests have finished baking
    default: 24
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
    - uses: peternied/bake-time@v2
      with:
        check-name: "Baking pull request..."
        delay-hours: 48
```

# Changelog

## Unreleased
- Baking pull requests will be updated to 'pending' with a message about how time remains. 

## v2
- Combined into a single step where the trigger determines the behavior
- Stopped using write operations during the 'pull_request' trigger, by default no write permissions are allowed [[link]](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)

## v1
- Initial Release
