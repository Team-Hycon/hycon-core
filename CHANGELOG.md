HYCON CORE CHANGELOG
======
## Version 0.2.0 - Jabiru - Hard Fork
- Reduction in mining reward by 90%
- Decrease in total supply to 5 billion HYC
- Replay protection implemented
- Exodus block: A summary block of the first ~405000 blocks allowing clients to sync from that point rather than from Genesis; Necessary due to major bug in core software
- Inclusion of uncle blocks as part of the difficulty adjustment procedure
- New difficulty adjustment algorithm that is better tuned to large fluctuations in hashpower (paper coming soon)
- One major bugfix - See Exodus block description and medium post
- Various minor bugfixes
## Version 0.1.0 - Ibis - Hard Fork
- Implementation of GHOST protocol
- Halving of block time
- Block reward halved to match block time decrease
- Bugfixes
## Version 0.0.9 - Halcyon
- Networking upgrades and general performance improvements
- Added support for Digital Bitbox Hardware wallet
- Gui tweaks
- Various bugfixes
## Version 0.0.8 - Goose
- Added HD Wallets to GUI
- Improved transaction validation
- Network performance improvements
- GUI improvements
- Various bugfixes
## Version 0.0.7 - Flamingo
- Ledger Nano support added to Block Explorer
- Favorites changed to Address Book in wallet tab
- Synchronisation Performance Updates
- Transaction Syncing Added - When syncing, no need to send headers again, only transactions are sent, reducing network overhead
- Fast Peer Database - Allows you to select the most likely client when connecting to the hycon network
- Update Hashrate calculation in miner view
- Remove GPU mining UI
## Version 0.0.6 - Emu
- Transaction Broadcasting Improvements
- Block Broadcasting Improvements
- Non-local startup flag re-enabled, added data flag to allow for specification of data storage directory
- Rest interface update
## Version 0.0.5 - Dodo
- GUI Improvements
- ICO Wallet Claim Function
## Version 0.0.4 - Canary
- Fix for lock queue high errors
## Version 0.0.3 - HYCON
- Improved Tx Pool
- Increased Syncing Speed
## Version 0.0.2 - HYCON
- Synchronisation Bug Fixes
## Version 0.0.1 - HYCON
- Initial Release
