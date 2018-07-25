import {
    IBlock,
    IHyconWallet,
    ILocationDetails,
    IMinedInfo,
    IMiner,
    IPeer,
    IResponseError,
    IRest,
    ITxProp,
    IUser,
    IWalletAddress,
} from "./rest"
import { WalletDetail } from "./walletDetail"
// tslint:disable:no-console
// tslint:disable:ban-types
// tslint:disable:object-literal-sort-keys
export class RestClient implements IRest {

    public apiVersion = "v1"
    public loading: boolean
    public isHyconWallet: boolean
    public callback: (loading: boolean) => void

    public loadingListener(callback: (loading: boolean) => void): void {
        this.callback = callback
    }
    public setLoading(loading: boolean): void {
        this.loading = loading
        this.callback(this.loading)
    }

    public createNewWallet(meta: IHyconWallet): Promise<IHyconWallet | IResponseError> {
        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        return Promise.resolve(fetch(`/api/${this.apiVersion}/wallet`, {
            method: "POST",
            headers,
            body: JSON.stringify(meta),
        })
            .then((response) => response.json())
            .catch((err: Error) => {
                console.log(err)
            }))
    }

    public getWalletBalance(address: string): Promise<{ balance: string } | IResponseError> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/wallet/${address}/balance`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public getWalletTransactions(address: string, nonce?: number): Promise<{ txs: ITxProp[] } | IResponseError> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/wallet/${address}/txs/${nonce}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public outgoingSignedTx(tx: { privateKey: string, to: string, amount: string, fee: string, nonce: number }, queueTx?: Function): Promise<{ txHash: string } | IResponseError> {
        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        return Promise.resolve(fetch(`/api/${this.apiVersion}/signedtx`, {
            method: "POST",
            headers,
            body: JSON.stringify({ privateKey: tx.privateKey, to: tx.to, amount: tx.amount, fee: tx.fee, nonce: tx.nonce }),
        })
            .then((response) => response.json())
            .catch((err: Error) => {
                console.log(err)
            }))
    }

    public outgoingTx(tx: { signature: string, from: string, to: string, amount: string, fee: string, recovery: number, nonce: number }, queueTx?: Function): Promise<{ txHash: string } | IResponseError> {
        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        return Promise.resolve(fetch(`/api/${this.apiVersion}/tx`, {
            method: "POST",
            headers,
            body: JSON.stringify({ signature: tx.signature, from: tx.from, to: tx.to, amount: tx.amount, fee: tx.fee, recovery: tx.recovery, nonce: tx.nonce }),
        })
            .then((response) => response.json())
            .catch((err: Error) => {
                console.log(err)
            }))
    }

    public deleteWallet(name: string): Promise<boolean> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/deleteWallet/${name}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public generateWallet(Hwallet: IHyconWallet): Promise<string> {
        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        return Promise.resolve(fetch(`/api/${this.apiVersion}/generateWallet`, {
            method: "POST",
            headers,
            body: JSON.stringify(Hwallet),
        })
            .then((response) => response.json())
            .catch((err: Error) => {
                console.log(err)
            }))
    }
    public getAddressInfo(address: string): Promise<IWalletAddress> {
        const apiVer = this.apiVersion
        return Promise.resolve(
            fetch(`/api/${apiVer}/address/${address}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }
    public getAllAccounts(name: string, password: string, startIndex: number): Promise<Array<{ address: string, balance: string }> | boolean> {
        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        return Promise.resolve(fetch(`/api/${this.apiVersion}/getAllAccounts`, {
            method: "POST",
            headers,
            body: JSON.stringify({ name, password, startIndex }),
        })
            .then((response) => response.json())
            .catch((err: Error) => {
                console.log(err)
            }))
    }
    public getBlock(hash: string): Promise<IBlock | IResponseError> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/block/${hash}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }
    public getBlockList(index: number): Promise<{ blocks: IBlock[], length: number }> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/blockList/${index}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public getTopTipHeight(): Promise<{ height: number }> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/topTipHeight`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public getMnemonic(lang: string): Promise<string> {
        // console.log(lang.toLowerCase())
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/getMnemonic/${lang.toLowerCase()}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }
    public getTx(hash: string): Promise<ITxProp> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/tx/${hash}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }
    public getWalletDetail(name: string): Promise<IHyconWallet | IResponseError> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/wallet/detail/${name}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }
    public getWalletList(idx?: number): Promise<{ walletList: IHyconWallet[], length: number }> {
        if (idx === undefined) {
            return Promise.resolve(
                fetch(`/api/${this.apiVersion}/wallet`)
                    .then((response) => response.json())
                    .catch((err: Error) => {
                        console.log(err)
                    }),
            )
        } else {
            return Promise.resolve(
                fetch(`/api/${this.apiVersion}/wallet/${idx}`)
                    .then((response) => response.json())
                    .catch((err: Error) => {
                        console.log(err)
                    }),
            )
        }
    }

    public recoverWallet(Hwallet: IHyconWallet): Promise<string | boolean> {
        Hwallet.language = Hwallet.language.toLowerCase()
        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        return Promise.resolve(fetch(`/api/${this.apiVersion}/recoverWallet`, {
            method: "POST",
            headers,
            body: JSON.stringify(Hwallet),
        })
            .then((response) => response.json())
            .catch((err: Error) => {
                console.log(err)
            }))
    }
    public sendTx(tx: { name: string, password: string, address: string, amount: string, minerFee: string, nonce: number }, queueTx?: Function): Promise<{ res: boolean, case?: number }> {
        console.log(tx.name)
        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        return Promise.resolve(fetch(`/api/${this.apiVersion}/transaction`, {
            method: "POST",
            headers,
            body: JSON.stringify({ name: tx.name, password: tx.password, address: tx.address, amount: tx.amount, minerFee: tx.minerFee, nonce: tx.nonce }),
        })
            .then((response) => response.json())
            .catch((err: Error) => {
                console.log(err)
            }))
    }

    public getPendingTxs(index: number): Promise<{ txs: ITxProp[], length: number, totalCount: number, totalAmount: string, totalFee: string }> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/txList/${index}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public getPeerList(): Promise<IPeer[]> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/peerList`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public getPeerConnected(index: number): Promise<{ peersInPage: IPeer[], pages: number }> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/peerConnected/${index}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public getHint(name: string): Promise<string> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/hint/${name}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public getNextTxs(address: string, txHash: string, index: number): Promise<ITxProp[]> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/nextTxs/${address}/${txHash}/${index}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public getNextTxsInBlock(blockhash: string, txHash: string, index: number): Promise<ITxProp[]> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/nextTxsInBlock/${blockhash}/${txHash}/${index}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public checkDupleName(name: string): Promise<boolean> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/dupleName/${name}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public getMinedBlocks(address: string, blockHash: string, index: number): Promise<IMinedInfo[]> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/getMinedInfo/${address}/${blockHash}/${index}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public getMiner(): Promise<IMiner> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/getMiner`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public setMiner(address: string): Promise<boolean> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/setMiner/${address}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public startGPU(): Promise<boolean> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/startGPU`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public setMinerCount(count: number): Promise<void> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/setMinerCount/${count}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public getFavoriteList(): Promise<Array<{ alias: string, address: string }>> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/favorites`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public addFavorite(alias: string, address: string): Promise<boolean> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/favorites/add/${alias}/${address}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }
    public deleteFavorite(alias: string) {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/favorites/delete/${alias}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public addWalletFile(name: string, password: string, key: string): Promise<boolean> {
        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        return Promise.resolve(fetch(`/api/${this.apiVersion}/addWalletFile`, {
            method: "POST",
            headers,
            body: JSON.stringify({ name, password, key }),
        })
            .then((response) => response.json())
            .catch((err: Error) => {
                console.log(err)
            }))
    }

    public getLedgerWallet(startIndex: number, count: number): Promise<IHyconWallet[] | number> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/getLedgerWallet/${startIndex}/${count}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }

    public sendTxWithLedger(index: number, from: string, to: string, amount: string, fee: string, queueTx?: Function): Promise<{ res: boolean, case?: number }> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/sendTxWithLedger/${index}/${from}/${to}/${amount}/${fee}`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(`Error when sendTxWithLedger`)
                    console.log(err)
                }),
        )
    }

    public possibilityLedger(): Promise<boolean> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/possibilityLedger`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(`Error when sendTxWithLedger`)
                    console.log(err)
                }),
        )
    }

    public getMarketCap(): Promise<{ amount: string }> {
        return Promise.resolve(
            fetch(`/api/${this.apiVersion}/getMarketCap`)
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(`Error when getMarketCap`)
                    console.log(err)
                }),
        )
    }
}
