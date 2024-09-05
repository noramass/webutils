# monorepo-semantic-release
Template for monorepos using semantic release with pnpm

## Getting Started

To create a new module in this repository, create a new directory in the packages directory.
After that, run `pnpm packages:prepare`. This will initialise the module from the skeleton in `config/skeleton`.

Alternatively set up your module manually in the packages directory.

By default, packages use [tsup](https://tsup.egoist.dev/) to bundle modules based on the
[exports configuration](https://tsup.egoist.dev/) of their respective package.json file. Exports are to be made in
conditional configuration and should include a custom `entry` condition to specify the entry path for this export.
This behaviour can be overridden or extended by passing a second argument to the `tsupConfig` function or by providing
your own configuration or build step.

## Releases

To set up automatic releases, [semantic-release](https://www.conventionalcommits.org/en/v1.0.0/) needs both a GitHub and
NPM token to release modules with. These need to be configured as secrets in this repository and named `GH_TOKEN` and
`NPM_TOKEN` respectively.

Make sure the GitHub token has access to this repository.

Releases will be made individually for each module for each relevant commit on the `main` branch.

Depending on the type of commit, they are considered for release and affect versioning in different ways.

| Commit Type     | Description                                                      | Release              |
|-----------------|------------------------------------------------------------------|----------------------|
| fix             | A bugfix                                                         | Bumps patch version  |
| refactor        | Refactoring of existing code                                     | Bumps patch version  |
| feat            | A new feature was added, an api was changed                      | Bumps minor version  |
| chore           | Task that does not affect the repository in a meaningful way     | No change            |
| ci              | Changes to continuous integration or deployment                  | No change            |
| style           | Code-style changes with no impact on functionality, reformatting | No change            |
| docs            | Updates to documentation                                         | No change            |
| `!` suffix      | Breaking change, always a major release                          | Bumps major version  |
| BREAKING CHANGE | Breaking change, always a major release                          | Bumps major version  |

## Conventions

Please follow [conventional commit guidelines](https://www.conventionalcommits.org/en/v1.0.0/), as they are taken into
consideration when creating releases and generating changelogs, etc.

A conventional commit follows the format `type(scope): short message` or just `type: short message`, where `type`
is a predefined specifier, `scope` is the "topic" of the commit, for example the feature it affects, and a short
message describing what has changed and why.

If you need to include more detail in your commit messages, leave an empty line after the first and write a detailed
description on the third line and following.

Additionally, an exclamation mark can be used to mark a commit as a
breaking change (`type(scope)!: short message`) or by including "BREAKING CHANGE" somewhere in the commit message.

## Resources
- [Semantic Release](https://github.com/semantic-release/semantic-release)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [TSUP](https://tsup.egoist.dev/)
- [Package Exports](https://nodejs.org/api/packages.html#exports)
