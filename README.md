<p align="center">
  <a href="https://hycon.io" rel="noopener" target="_blank"><img width="300" src="http://www.hycon.io/wp-content/uploads/2018/08/hycon_logo2.png" alt="Hycon logo"></a></p>
</p>

<h1 align="center">Hycon Core</h1>

<div align="center">
Powering hyperconnected blockchain solutions

[![Github All Releases](https://img.shields.io/github/downloads/Team-Hycon/hycon-core/total.svg)](http://www.somsubhra.com/github-release-stats/?username=Team-Hycon&repository=hycon-core)
![](https://img.shields.io/github/license/Team-Hycon/hycon-core.svg)
[![Follow on Twitter](https://img.shields.io/twitter/follow/TeamHycon.svg?label=follow+Team-Hycon)](https://twitter.com/teamhycon)
[![Dependencies](https://img.shields.io/david/Team-Hycon/hycon-core.svg)](https://david-dm.org/Team-Hycon/hycon-core)
[![DevDependencies](https://img.shields.io/david/dev/Team-Hycon/hycon-core.svg)](https://david-dm.org/Team-Hycon/hycon-core?type=dev)
</div>


Welcome to the HYCON source code repository! Our goal at HYCON is to enable a faster and more scalable blockchain for many different use cases.

We have a lot of exciting developments coming up, and we'll have our timeline added to [Issues](https://github.com/Team-Hycon/hycon-core/issues) in the near future.

## General Information

For more information about HYCON, visit the website at [https://hycon.io](https://hycon.io) or read the whitepaper in one of the following languages:

- [English](https://hycon.io/wp-content/uploads/2018/08/whitepaper1.2.2_en.pdf)
- [Korean / 한국어](https://hycon.io/wp-content/uploads/2018/08/whitepaper.1.2.2_kr.pdf)
- [Japanese / 日本語](https://hycon.io/wp-content/uploads/2018/08/whitepaper_jp.pdf)
- [Chinese / 中文](https://hycon.io/wp-content/uploads/2018/08/whitepaper_cn.pdf)

## Running Hycon

### Full node on the main Hycon network

If you would like the entire Hycon blockchain locally and want to interact with the network (create wallets and transfer funds), you can sync quickly to the current state of the network after deploying a Hycon node. There are two methods to do so: using the latest release or clone the repository. **We highly recommend using a release if you do not plan on developing `hycon-core`.**

#### Getting Releases

We aim to create a release periodically with improvements to node and the network. You can find our latest releases in the [Releases](https://github.com/Team-Hycon/hycon-core/releases) section.

Downloading and unzipping the archived file will allow you to run the full node and mine on your system. For more information, check out the Wiki article [here](https://github.com/Team-Hycon/hycon-core/wiki/Mining-Instructions). We currently support Ubuntu, MacOS X, and Windows operating systems.

#### Clone and Deploy

- Clone the repository or pull the latest commit
- Ensure that you have [`npm`](https://www.npmjs.com/) installed
- `$ npm i` to install the required node dependencies
- `$ npm run hycon` to start your node and sync with the network

### Hycon Wallet

If you only want to interact with the network (create wallets and transfer funds), you can download any of the following applications to create or recover your wallet.

#### Lite Client

[Chrome Extension](https://chrome.google.com/webstore/detail/hycon-lite-client/bcopgchhojmggmffilplmbdicgaihlkp?hl=en)

[Desktop App](https://github.com/Team-Hycon/hycon-gui/releases)

#### Hycon Pocket (Mobile App)

[Android](https://play.google.com/store/apps/details?id=io.hycon.litewallet&hl=en)

[iOS](https://itunes.apple.com/us/app/hycon-pocket/id1439548798?mt=8&app=itunes&ign-mpt=uo%3D4)

## API Documentation

The documentation for all of the api routes available on a hycon node can be found at [docs.hycon.io](https://docs.hycon.io).

## Mining

HYCON currently uses the ASIC-resistant `cryptonight-v7` proof-of-work algorithm. We have made some adjustments to [xmrig](https://github.com/xmrig) to ensure that the GPU miner runs smoothly with the HYCON node. For your ease of use, binary releases have been created for each variant.

Please check out the repository that is relevant to your system to begin mining: 

- [AMD](https://github.com/Team-Hycon/xmrig-amd)
- [CPU](https://github.com/Team-Hycon/xmrig)
- [Nvidia](https://github.com/Team-Hycon/xmrig-nvidia)

Credits to [xmrig](https://github.com/xmrig) for the development of their cryptonight miner.

## Issues & Pull Requests

Please check out [Contributing](https://github.com/Team-Hycon/hycon-core/blob/master/CONTRIBUTING.md) to see how you can submit an issue or a pull request. Please use the supplied templates related to your issues and PRs.

**If you have found a security bug, please contact us at [security@glosfer.com](security@glosfer.com).**

## Updates - Past and Present

To see what's to come in the near future, feel free to take a look at [roadmap](https://github.com/Team-Hycon/hycon-core/blob/master/ROADMAP.md) to see what we prioritize and plan.

To see what we've done in the past, take a look at the [changelog](https://github.com/Team-Hycon/hycon-core/blob/master/CHANGELOG.md).

## Social Channels

| Site | Link |
|:-----------|:-----------|
| Facebook | https://www.facebook.com/teamhycon |
| Instagram | https://www.instagram.com/teamhycon/ |
| Medium | https://medium.com/@teamhycon |
| Reddit | https://www.reddit.com/r/HYCON/ |
| Twitter | https://twitter.com/teamhycon |
| Telegram (General Chat) | https://t.me/teamhycon |
| Telegram (Announcements) | https://t.me/hyconofficial |
| YouTube | https://www.youtube.com/teamhycon |
| Email | contact@hycon.io |
