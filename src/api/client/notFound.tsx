import { Grid } from "@material-ui/core"
import * as React from "react"
import { Link } from "react-router-dom"

export class NotFound extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        // this.state = {
        //     name: props.name,
        //     rest: props.rest,
        // }
    }
    public render() {
        return (
            <div style={{ textAlign: "center" }}>
                <div className="errTitle">404: Page not found</div>
                <div>Sorry, the page you tried connot be found</div>
                <br></br>
                <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                    <Link to="/"><button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                    >BACK TO HOME</button></Link>
                </Grid>
            </div>
        )
    }
}

// export default NotFound
