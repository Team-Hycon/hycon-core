import { Button, Dialog, DialogTitle, Grid, Icon, List, ListItem, ListItemText } from "@material-ui/core"
import CardContent from "@material-ui/core/CardContent"
import { Card, CircularProgress } from "material-ui"
import * as React from "react"
import update = require("react-addons-update")
import { Link } from "react-router-dom"
import { IHyconWallet, IMiner, IRest } from "./rest"
interface IMinerViewProps {
    rest: IRest
}
interface IMinerView {
    rest: IRest
    dialogOpen: boolean
    wallets: IHyconWallet[]
    isLoading: boolean
    minerAddress: string
    cpuMinerCount: number
    adjustCpuMiner: boolean
    tmpCpuCount: number
    miner?: IMiner
}
export class MinerView extends React.Component<IMinerViewProps, IMinerView> {
    public mounted: boolean = false
    constructor(props: IMinerViewProps) {
        super(props)
        this.state = { rest: props.rest, dialogOpen: false, wallets: [], isLoading: false, minerAddress: "", cpuMinerCount: 0, adjustCpuMiner: false, tmpCpuCount: 0 }
        this.setMinerAddress = this.setMinerAddress.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleListItemClick = this.handleListItemClick.bind(this)
        this.startGPUMiner = this.startGPUMiner.bind(this)
        this.adjustCpuMiner = this.adjustCpuMiner.bind(this)
        this.minusCount = this.minusCount.bind(this)
        this.plusCount = this.plusCount.bind(this)
        this.applyCount = this.applyCount.bind(this)
    }
    public componentWillUnmount() {
        this.mounted = false
    }
    public componentDidMount() {
        this.mounted = true
        this.state.rest.setLoading(true)
        this.state.rest.getMiner().then((data: IMiner) => {
            this.setState({ miner: data, minerAddress: data.currentMinerAddress, cpuMinerCount: data.cpuCount })
            this.state.rest.setLoading(false)

        })
    }
    public render() {
        if (this.state.miner === undefined) {
            return <div></div>
        }
        return (
            <div>
                <h4 style={{ color: "grey" }}>Miner View</h4>
                <Grid container direction={"row"}>
                    <Card style={{ width: "48%", margin: "1% 1% 0% 0%", backgroundColor: "rgb(239, 239, 239)" }}>
                        <CardContent>
                            <div>
                                <Icon style={{ marginRight: "10px", color: "grey", fontSize: "40px", paddingTop: "1%" }}>network_check</Icon>
                                <span style={{ float: "right", color: "grey", fontSize: "25px", paddingTop: "2%" }}>
                                    <span style={{ float: "right", color: "grey" }}>{this.state.miner.cpuHashRate} H/s</span><br />
                                    <span style={{ float: "right", color: "grey", fontSize: "12px" }}>CPU Hash Rate</span>
                                </span>
                            </div>
                        </CardContent>
                    </Card >
                    <Card style={{ width: "48%", margin: "1% 1% 0% 0%", backgroundColor: "rgb(239, 239, 239)" }}>
                        <CardContent>
                            <div>
                                <Icon style={{ marginRight: "10px", color: "grey", fontSize: "40px", paddingTop: "1%" }}>multiline_chart</Icon>
                                <span style={{ float: "right", color: "grey", fontSize: "25px", paddingTop: "2%" }}>
                                    <span style={{ float: "right", color: "grey" }}>{this.state.miner.networkHashRate.toLocaleString()} H/s</span><br />
                                    <span style={{ float: "right", color: "grey", fontSize: "12px" }}>Estimated Average Network Hash Rate</span>
                                </span>
                            </div>
                        </CardContent>
                    </Card >
                </Grid>
                <br />
                <h4 style={{ color: "grey" }}>Miner Wallet</h4>
                <Grid container direction={"row"}>
                    <Card style={{ width: "48%", margin: "1% 1% 0% 0%", backgroundColor: "rgb(239, 239, 239)" }}>
                        <button style={{ border: "0", outline: "0", backgroundColor: "rgb(239, 239, 239)", width: "100%", textAlign: "left" }} onClick={this.setMinerAddress}>
                            <CardContent>
                                <div>
                                    <Icon style={{ marginRight: "10px", color: "grey", fontSize: "40px", paddingTop: "1%" }}>account_balance_wallet</Icon>
                                    <span style={{ float: "right", color: "grey", fontSize: "20px", paddingTop: "2%" }}>
                                        <span style={{ float: "right", color: "grey", fontSize: "0.8em" }}>{this.state.minerAddress}</span><br />
                                        <span style={{ float: "right", color: "grey", fontSize: "12px" }}>Miner Address</span>
                                    </span>
                                </div>
                            </CardContent>
                        </button>
                    </Card >
                    <Card style={{ width: "48%", margin: "1% 1% 0% 0%", backgroundColor: "rgb(239, 239, 239)" }}>
                        <button style={{ border: "0", outline: "0", backgroundColor: "rgb(239, 239, 239)", width: "100%", textAlign: "left" }} onClick={this.adjustCpuMiner}>
                            <CardContent>
                                <div>
                                    <Icon style={{ marginRight: "10px", color: "grey", fontSize: "40px" }}>toys</Icon>
                                    <span style={{ float: "right", color: "grey", fontSize: "20px", paddingTop: "2%" }}>
                                        <span style={{ float: "right", color: "grey" }}>{this.state.cpuMinerCount} CPU</span><br />
                                        <span style={{ float: "right", color: "grey", fontSize: "12px" }}>Click to adjust</span>
                                    </span>
                                </div>
                            </CardContent>
                        </button>
                    </Card >
                </Grid>
                <Dialog open={this.state.dialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <div className={`${this.state.isLoading ? "hide" : ""}`}>
                        <DialogTitle id="simple-dialog-title" style={{ textAlign: "center" }}>Select Miner Address</DialogTitle>
                        <List>
                            {this.state.wallets.map((wallet: IHyconWallet) => (
                                < ListItem button onClick={() => this.handleListItemClick(wallet)} key={wallet.name}>
                                    <Icon style={{ color: "grey" }}>account_balance_wallet</Icon>
                                    <ListItemText primary={wallet.name} secondary={wallet.address} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    {this.state.isLoading ? (<CircularProgress style={{ marginRight: "5px", backgroundColor: "none" }} size={50} thickness={2} />) : (<div></div>)}
                </Dialog>
                <Dialog open={this.state.adjustCpuMiner} onClose={this.handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <div className={`${this.state.isLoading ? "hide" : ""}`}>
                        <DialogTitle id="simple-dialog-title" style={{ textAlign: "center" }}>Adjust CPU Miner Count</DialogTitle>
                        <div style={{ textAlign: "center" }}>
                            <Button onClick={this.minusCount} variant="outlined" style={{ minWidth: "10%" }}>-</Button>
                            <span style={{ margin: "20%" }}>{this.state.tmpCpuCount}</span>
                            <Button onClick={this.plusCount} variant="outlined" style={{ minWidth: "10%" }}>+</Button>
                        </div>
                        <Button onClick={this.applyCount} style={{ float: "right", margin: "5%" }}>
                            <Icon>check</Icon><span>Apply</span>
                        </Button>
                    </div>
                    {this.state.isLoading ? (<CircularProgress style={{ marginRight: "5px", backgroundColor: "none" }} size={50} thickness={2} />) : (<div></div>)}
                </Dialog>
            </div >
        )
    }
    private setMinerAddress() {
        this.state.rest.setLoading(true)
        this.state.rest.getWalletList().then((data: { walletList: IHyconWallet[], length: number }) => {
            if (this.mounted) {
                this.setState({ wallets: data.walletList, dialogOpen: true })
            }
            this.state.rest.setLoading(false)
        })
    }

    private handleClose() {
        this.setState({ dialogOpen: false, adjustCpuMiner: false })
    }

    private handleListItemClick(wallet: IHyconWallet) {
        if (wallet.address === this.state.minerAddress) {
            alert(`This address is currently set as a miner's wallet. If you would like to change your miner address, please select another wallet.`)
        } else {
            if (confirm(`Do you agree to change your miner wallet address from ${this.state.minerAddress} to ${wallet.address}?`)) {
                this.setState({ isLoading: true })
                this.state.rest.setMiner(wallet.address).then((result: boolean) => {
                    if (result) {
                        this.setState({ minerAddress: wallet.address, dialogOpen: false, isLoading: false })
                    } else { alert(`Failed to change miner address. Please try again.`) }
                    this.setState({ isLoading: false })
                })
            }
        }
    }

    private plusCount() {
        this.setState({ tmpCpuCount: this.state.tmpCpuCount + 1 })
    }

    private minusCount() {
        if (this.state.tmpCpuCount > 0) {
            this.setState({ tmpCpuCount: this.state.tmpCpuCount - 1 })
        }
    }

    private adjustCpuMiner() {
        this.setState({ adjustCpuMiner: true, tmpCpuCount: this.state.cpuMinerCount })
    }

    private applyCount() {
        if (this.state.tmpCpuCount === this.state.cpuMinerCount) {
            this.setState({ adjustCpuMiner: false })
        } else {
            this.state.rest.setMinerCount(this.state.tmpCpuCount).then(() => {
                this.setState({ cpuMinerCount: this.state.tmpCpuCount, adjustCpuMiner: false })
            })
        }
    }
    private startGPUMiner() {
        this.state.rest.startGPU().then((result: boolean) => {
            if (!result) {
                alert(`GPU binary file does not exist or GPU miner can not be executed because config is not set properly. Please try again.`)
            }
        })
    }
}
