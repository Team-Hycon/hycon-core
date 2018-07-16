import { DialogTitle, Input, ListItemText } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import Icon from "@material-ui/core/Icon"
import { Avatar, IconButton, List, ListItem, TextField } from "material-ui"
import * as React from "react"
import update = require("react-addons-update")

export class AddressBook extends React.Component<any, any> {
    public mounted = false

    constructor(props: any) {
        super(props)

        this.state = {
            address: "",
            alias: "",
            clickCallback: props.callback,
            favorites: props.favorites,
            isWalletVeiw: props.isWalletView,
            rest: props.rest,
        }
        this.handleInputChange = this.handleInputChange.bind(this)
    }
    public componentWillUnmount() {
        this.mounted = false
    }
    public componentDidMount() {
        this.mounted = true
    }

    public handleInputChange(event: any) {
        const name = event.target.name
        const value = event.target.value
        this.setState({ [name]: value })
    }
    public render() {
        return (
            <div style={{ textAlign: "center" }}>
                <DialogTitle id="simple-dialog-title" style={{ textAlign: "center" }}><Icon style={{ marginRight: "10px", color: "grey" }}>bookmark</Icon>Address Book</DialogTitle>
                {(this.state.favorites.length === 0) ? (<h5 style={{ color: "grey" }}>No Address</h5>) : (<div></div>)}
                <List style={{ width: "32em" }}>
                    {(this.state.isWalletVeiw) ?
                        (<div>
                            {this.state.favorites.map((favorite: { alias: string, address: string }, idx: number) => (
                                <ListItem
                                    style={{ textAlign: "left", width: "26em", backgroundColor: "white", margin: "auto" }}
                                    leftAvatar={<Avatar icon={<Icon>account_balance_wallet</Icon>} />}
                                    primaryText={favorite.alias}
                                    secondaryText={favorite.address}
                                    key={idx}
                                    rightIconButton={<IconButton iconStyle={{ color: "grey" }} onClick={() => { this.handleListItemClick(favorite, idx) }}><Icon>clear</Icon></IconButton>}
                                />
                            ))}
                            {(this.state.isAdd ?
                                (<div>
                                    <div style={{ textAlign: "left", paddingLeft: "7.4%", paddingTop: "3%" }}>
                                        <Avatar icon={<Icon style={{ color: "white" }}>fiber_new</Icon>} />
                                        <span style={{ display: "-webkit-inline-box", paddingLeft: "3.5%", width: "26em" }}>
                                            <Input style={{ marginRight: "3%", width: "9em" }} name="alias" placeholder="Alias" inputProps={{ "aria-label": "Description" }} value={this.state.alias} onChange={this.handleInputChange} /><br />
                                            <Input style={{ width: "21em" }} name="address" placeholder="Address" inputProps={{ "aria-label": "Description" }} value={this.state.address} onChange={this.handleInputChange} />
                                        </span>
                                    </div>
                                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                                        <IconButton iconStyle={{ textAlign: "center", color: "grey", borderRadius: "50%", backgroundColor: "lightgrey" }} onClick={() => { this.addFavorite() }}><Icon>check</Icon></IconButton><br />
                                    </Grid>
                                </div>) :
                                (<div>
                                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                                        <IconButton iconStyle={{ textAlign: "center", color: "grey", borderRadius: "50%", backgroundColor: "lightgrey" }} onClick={() => { this.addAddress() }}><Icon>add</Icon></IconButton><br />
                                    </Grid>
                                </div>))}

                        </div>) :
                        (<div>
                            {this.state.favorites.map((favorite: { alias: string, address: string }) => (
                                <ListItem
                                    style={{ textAlign: "left", width: "23em", margin: "auto" }}
                                    leftAvatar={<Avatar icon={<Icon>account_balance_wallet</Icon>} />}
                                    primaryText={favorite.alias}
                                    secondaryText={favorite.address}
                                    key={favorite.alias}
                                    onClick={() => { this.state.clickCallback(favorite.address) }}
                                />
                            ))}<br />
                        </div>)}
                </List>
            </div>
        )
    }

    private addAddress() {
        this.setState({ isAdd: true, alias: "", address: "" })
    }

    private addFavorite() {
        if (this.state.alias === "" || this.state.address === "") {
            alert(`Please enter 'Alias' and 'Address' together`)
            return
        }
        this.state.rest.addFavorite(this.state.alias, this.state.address).then((data: boolean) => {
            const alias = this.state.alias
            const address = this.state.address
            if (data) {
                alert(`Successfully saved`)
                this.setState({
                    address: "",
                    alias: "",
                    favorites: update(this.state.favorites, { $push: [{ alias, address }] }),
                    isAdd: false,
                })
            } else {
                alert(`Fail to save address`)
            }
        })
    }

    private handleListItemClick(element: { alias: string, address: string }, idx: number) {
        if (confirm(`Are you sure delete ${element.alias} from address book?`)) {
            this.state.rest.deleteFavorite(element.alias).then((res: boolean) => {
                res ? alert(`Successfully deleted`) : alert(`Fail to update address book`)
                this.setState({
                    favorites: update(this.state.favorites, { $splice: [[idx, 1]] }),
                    isAdd: false,
                })
            })
        }
    }
}
