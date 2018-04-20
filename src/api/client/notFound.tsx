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
            <div>
                <div className="errTitle">404: Page not found</div>
                <div>Sorry, the page you tried connot be found</div>
                <br></br>
                <Link to="/"><button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                >BACK TO HOME</button></Link>
            </div>
        )
    }
}

// export default NotFound
