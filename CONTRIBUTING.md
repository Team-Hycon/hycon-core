# Contributing

Thank you for taking the time to contribute! :tada::+1:

The following provides guidelines, processes, and standardized information for contributing to hycon-core, and its related packages and applications. These are hosted in [Team Hycon](https://github.com/Team-Hycon) on GitHub.

## Code of Conduct

This project and everyone participating in it is governed by the [Hycon Code of Conduct](https://github.com/Team-Hycon/hycon-core/blob/master/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [contact@hycon.io](mailto:contact@hycon.io).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for `hycon-core`. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating bug reports, please check if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one. Otherwise, please include as many details a possible in the [required template](https://github.com/Team-Hycon/hycon-core/blob/master/.github/ISSUE_TEMPLATE/1.bug.md).

**Please do not disclose vulnerabilities in a bug report. Please send an email to [security@hycon.io](mailto:security@hycon.io) if you discover a vulnerability.**

### Pull Requests

This section guides you through submitting a pull request for `hycon-core`. Following these guidelines helps maintainers and the community:

- Maintain `hycon-core`'s quality
- Fix problems that are important to the Hycon network and its community
- Engage the community in working towards a faster, more secure network, or to increase the usability of Hycon
- Enable a sustainable system for Hycon's maintainers to review contributions

Pull requests are always welcome, but, before working on a large change, it is best to open an issue first to discuss it with the maintainers.

When in doubt, keep your pull requests small. To give a PR the best chance of getting accepted, don't bundle more than one feature or bug fix per pull request. Lastly, please follow and complete the [required template](https://github.com/Team-Hycon/hycon-core/blob/master/.github/PULL_REQUEST.md). 


## Coding Style

Please follow the coding style of the project. `hycon-core` uses `tslint`, so if possible, enable linting in your editor to get real-time feedback. Our `tslint` settings can be found [here](https://github.com/Team-Hycon/hycon-core/blob/master/tslint.json).

## Labels

This section lists the labels we use to help us track and manage issues and pull requests. The labels are loosely grouped by their purpose, but it's not required that every issue have a label from every group or that an issue can't have more than one label from the same group.

### General

Label | Description
------|------------
`bug` | something isn't working
`enhancement` | new feature or request
`invalid` | not a valid issue
`help wanted` | help wanted from user(s)
`duplicate` | exists elsewhere
`question` | question sent by user(s)
`wontfix` | will not be fixed (this release or ever)
`good first issue` | help wanted from new user(s)

### Process-related

Label | Description
------|------------
`more info needed` | more info needed, either in issue or via email correspondence
`in progress` | details are complete, work is in progress
`need fix` | suggests that code has unexpected or unwanted behavior
`need review` | awaits review from someone from R&D team
`under review` | under review from someone from R&D team
`merge imminent` | awaits merge with the codebase
`merged` | merge completed
`paused` | feature or fix is paused until another release
`blocked` | feature or fix will nto be merged in the near future or indefinitely
`stale` | abandoned, either intentionally or otherwise

### Category-related

Label | Description
------|------------
`api` | REST API
`core` | core functionality of hycon-core
`cryptography` | cryptography-related (e.g. secp256k1, blake2b)
`db` | database-related
`difficulty` | difficulty-related (usually specific to mining)
`docs` | documentation
`localization` | translations and localization-related
`mining` | mining-related
`network` | network-related (e.g. node, peers, sync, UPnP, NAT)
`proof of concept` | new features and concepts
`proof of work` | proof-of-work related
`serialization` | serialization-related (usually specific to network)
`spectre` | SPECTRE protocol related
`tech debt` | feature(s) that need refactoring or better implementation
`testing` | code-testing related (e.g. continuous integration, test cases)
`wallet` | HYC wallet related (e.g. storing coins, sending transactions, creating wallets)

### Process-related

Label | Description
------|------------
`I` | Typos, translations, documentation
`II` | Minor security bug, occasional exception catch, lesser category flaws
`III` | Node crashes, undefined behavior, severe security flaw
`***` | unimportant, may be _paused_
`**` | Must be fixed within a certain timeframe
`*` | Must be fixed immediately
`vuln` | security vulnerability, usually between severity II-III and priority 3.
`nodebreaker` | Code that results in node to crash unexpectedly. Severity I-III and priority 2-3, depends on frequency
`unexpected` | Unexpected behavior, may crash node

## Roadmap

To get a sense of where `hycon-core` is heading, or for ideas on where you could contribute, take a look at the [ROADMAP](https://github.com/Team-Hycon/hycon-core/blob/master/ROADMAP.md).

## License

By contributing your code to the Team-Hycon/hycon-core GitHub repository, you agree to license your contribution under the [MIT license](https://github.com/Team-Hycon/hycon-core/blob/master/LICENSE).