import { Dialog, DialogTitle, FormControlLabel, FormLabel, Radio, RadioGroup } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Icon from "@material-ui/core/Icon"
import { Avatar, List, ListItem, TextField } from "material-ui"
import * as React from "react"
import { Link, Redirect } from "react-router-dom"
import { AddressBook } from "./addressBook"
import { WalletList } from "./walletList"

export class WalletView extends React.Component<any, any> {
    public mounted: boolean = false
    constructor(props: any) {
        super(props)
        this.state = {
            address: "",
            alias: "",
            dialog1: false,
            dialog2: false,
            dialog3: false,
            favorites: [],
            filename: "",
            hardwareDialog: false,
            hardwareWalletType: "",
            ledgerAddress: "",
            load: false,
            possibilityLedger: false,
            privateKey: undefined,
            redirect: false,
            redirectBitbox: false,
            redirectLedger: false,
            redirectTxView: false,
            rest: props.rest,
            walletName: "",
            walletPass: "",
            walletType: "local",
        }
        this.nextMakeTx = this.nextMakeTx.bind(this)
    }
    public componentDidMount() {
        this.mounted = true
        this.state.rest.possibilityLedger().then((result: boolean) => {
            this.setState({ possibilityLedger: result })
            this.getFavorite()
        })
    }

    public handleInputChange(event: any) {
        const name = event.target.name
        const value = event.target.value
        this.setState({ [name]: value })
    }

    public addWalletPrivateKey() {
        const patternWalletName = /^[a-zA-Z0-9\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF]{2,20}$/
        if (this.state.walletName === "") {
            alert(`Please enter 'Name'`)
        } else if (this.state.walletName.search(/\s/) !== -1 || !patternWalletName.test(this.state.walletName)) {
            alert(`Invalid Wallet Name: must be between 2 and 20 characters, no spaces.`)
        } else {
            this.state.rest.addWalletFile(this.state.walletName, this.state.walletPass, this.state.privateKey).then((result: boolean) => {
                if (result) {
                    this.setState({ dialog3: false, redirect: true })
                } else {
                    alert(`Fail to load wallet from file. Check your key file or password.`)
                }
            })
        }
    }

    public nextMakeTx() {
        this.setState({ redirectTxView: true })
    }
    public render() {
        if (this.state.redirect) {
            return <Redirect to={`/wallet/detail/${this.state.walletName}`} />
        }
        if (this.state.redirectTxView) {
            return <Redirect to={`/maketransaction/${this.state.walletType}`} />
        }
        if (this.state.redirectBitbox) {
            return <Redirect to={`/hardwareWallet/bitbox`} />
        }
        if (this.state.redirectLedger) {
            return <Redirect to={`/hardwareWallet/ledger`} />
        }
        if (!this.state.load) {
            return <div></div>
        }
        return (
            <div>
                <div className="walletViewBtnDiv">
                    <button onClick={() => { this.setState({ dialog1: true }) }} className="mdl-button"><i className="material-icons">bookmark</i> ADDRESS BOOK</button>
                    <button className="mdl-button">
                        <Link to="/wallet/addWallet" className="coloredBlack"><i className="material-icons">note_add</i> ADD WALLET</Link>
                    </button>
                    <button className="mdl-button">
                        <Link to="/wallet/recoverWallet" className="coloredBlack"><i className="material-icons">input</i> RECOVER WALLET</Link>
                    </button>
                    {(this.state.possibilityLedger ? (<button onClick={() => { this.setState({ dialog2: true }) }} className="mdl-button"><i className="material-icons">send</i> TRANSFER</button>) : (<div></div>))}
                    {(this.state.possibilityLedger ? (
                        <button onClick={() => { this.setState({ hardwareDialog: true }) }} className="mdl-button"><i className="material-icons">account_balance_wallet</i> HARDWARE WALLET</button>
                    ) : (<div></div>))}
                </div>
                <div>
                    <WalletList rest={this.state.rest} />
                    <Grid container direction={"row"}>
                        <List>
                            <ListItem style={{ width: "23em" }}
                                leftAvatar={<Avatar icon={<i className="material-icons walletIcon_white">note_add</i>} />}
                                primaryText={"Load key from file"}
                                secondaryText={<input type="file" style={{ height: "20px" }} onChange={(e) => this.onDrop(e)} value={this.state.filename} />}
                            />
                        </List>
                    </Grid>
                </div>

                {/* ADDRESS BOOK */}
                <Dialog open={this.state.dialog1} onClose={() => { this.closeAddressBook() }}>
                    <AddressBook rest={this.state.rest} favorites={this.state.favorites} isWalletView={true} />
                </Dialog>

                {/* Transfer type select view */}
                <Dialog open={this.state.dialog2} style={{ textAlign: "center" }} onClose={() => { this.setState({ dialog2: false }) }}>
                    <h4 style={{ color: "grey" }}><Icon style={{ color: "grey", marginRight: "10px" }}>send</Icon>Make transaction</h4>
                    <div style={{ width: "32em" }}>
                        <FormLabel>Select wallet to use</FormLabel>
                        <RadioGroup style={{ width: "70%", margin: "auto" }} aria-label="walletType" name="walletType" value={this.state.walletType} onChange={(data) => { this.handleInputChange(data) }}>
                            <FormControlLabel value="local" control={<Radio />} label="Local wallet (Key File)" />
                            <FormControlLabel value="ledger" control={<Radio />} label="Hardware wallet (Ledger)" />
                            <FormControlLabel value="bitbox" control={<Radio />} label="Hardware wallet (Digital Bitbox)" />
                        </RadioGroup>
                    </div>
                    <Button onClick={this.nextMakeTx}>NEXT</Button>
                </Dialog>

                {/* ADD PRIVATE KEY */}
                <Dialog style={{ textAlign: "center" }} open={this.state.dialog3} onClose={() => { this.setState({ dialog3: false, filename: "" }) }}>
                    <DialogTitle id="simple-dialog-title" ><span style={{ display: "inline-flex" }}><Icon style={{ marginRight: "10px", color: "grey" }}>account_balance_wallet</Icon>Add Wallet</span></DialogTitle>
                    <div style={{ margin: "2em" }}>
                        <p>Input your wallet address name</p>
                        <TextField name="walletName" floatingLabelText="Name" floatingLabelFixed={true}
                            value={this.state.walletName}
                            onChange={(data) => { this.handleInputChange(data) }} /><br />
                        <TextField name="walletPass" floatingLabelText="Password" floatingLabelFixed={true} type="password" autoComplete="off"
                            value={this.state.walletPass}
                            onChange={(data) => { this.handleInputChange(data) }} />
                    </div><br />
                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                        <Button variant="raised" onClick={(e) => { this.setState({ dialog3: false, filename: "" }) }} style={{ backgroundColor: "rgb(225, 0, 80)", color: "white" }}>Cancel</Button>
                        <Button variant="raised" onClick={() => { this.addWalletPrivateKey() }} style={{ backgroundColor: "#50aaff", color: "white", margin: "0 10px" }}>Save</Button>
                    </Grid><br />
                </Dialog>

                {/* SELECT HARDWARE WALLET */}
                <Dialog open={this.state.hardwareDialog} onClose={() => { this.setState({ hardwareDialog: false }) }}>
                    <DialogTitle id="simple-dialog-title" style={{ textAlign: "center" }}><Icon style={{ marginRight: "10px", color: "grey" }}>account_balance_wallet</Icon>HARDWARE WALLET</DialogTitle>
                    <div style={{ textAlign: "center" }}>
                        <FormLabel>Select wallet to use.</FormLabel>
                        <RadioGroup style={{ width: "70%", margin: "auto" }} aria-label="hardwareWalletType" name="hardwareWalletType" value={this.state.hardwareWalletType} onChange={(data) => { this.handleInputChange(data) }}>
                            <FormControlLabel value="ledger" control={<Radio />} label="Ledger" />
                            <FormControlLabel value="bitbox" control={<Radio />} label="Digital Bitbox" />
                        </RadioGroup>
                    </div><br />
                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                        <Button variant="outlined" onClick={() => { this.selectHardwareWallet() }} style={{ margin: "0 10px" }}>Select</Button>
                    </Grid><br />
                </Dialog>
            </div >
        )
    }

    private onDrop(event: any) {
        this.setState({ filename: event.target.value })
        const reader = new FileReader()
        reader.onload = () => {
            this.setState({ dialog3: true, privateKey: reader.result })
        }
        reader.readAsText(event.target.files[0])
    }

    private closeAddressBook() {
        this.getFavorite()
        this.setState({ dialog1: false })
    }

    private getFavorite() {
        this.state.rest.setLoading(true)
        this.state.rest.getFavoriteList().then((data: Array<{ alias: string, address: string }>) => {
            this.state.rest.setLoading(false)
            if (this.mounted) {
                this.setState({ favorites: data, load: true })
            }
        })
    }

    private selectHardwareWallet() {
        switch (this.state.hardwareWalletType) {
            case "ledger":
                this.setState({ redirectLedger: true })
                break
            case "bitbox":
                this.setState({ redirectBitbox: true })
                break
        }
    }
}
