# setup-rclone

Installs and caches the [`rclone`](https://rclone.org) tool.

## Usage

```yaml
# in your job:
name: MY GREAT JOB
on:
  push:
    branches:
      - '*'
jobs:
  rclone-example:
    name: rclone example!
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - uses: andrioid/setup-rclone@latest
    - name: Show folks how to run rclone:
      run: |
        rclone --help
```

## Local Development

Change the `index.ts` and remember to run `npm run build` afterwards. I use [esbuild](https://esbuild.github.io/) to bundle the source-code.

## Credits

- [setup-yq](https://github.com/chrisdickinson/setup-yq) inspired me to write this. His action is very lean and mean.
