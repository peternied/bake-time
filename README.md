# bake-time
Github actions to add a bake time check / finish pull requests that have fully baked

## start-baking

```yaml
inputs:
  github-token:
    description: The GitHub token used to create an authenticated client
    default: ${{ github.token }}
    required: true
  label-name:
    description: The label name for issues that are baking
    default: bake-time
    required: false
```

### Usage:

```yaml
on:
  pull_request:
    types:
      - opened
      - synchronize
...
jobs:
  on_pull_request:
    steps:
    - uses: peternied/bake-time/start-baking@v1
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
```

## finish-baking

```yaml
inputs:
  github-token:
    description: The GitHub token used to create an authenticated client
    default: ${{ github.token }}
    required: true
  label-name:
    description: The label name for issues that are baking
    default: bake-time
    required: false
  delay-hours:
    description: How many hours before pull requests have finished baking
    default: 24
    required: false
```

### Usage:

```yaml
steps:
  - uses: peternied/bake-time/finish-baking@v1
    with:
      github-token: ${{ secrets.GITHUB_TOKEN }}
      delay-hours: 48
```

# Changelog

## v1
- Initial Release