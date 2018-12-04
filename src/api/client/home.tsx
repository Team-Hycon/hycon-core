import * as React from "react"
import { BlockList } from "./blockList"

export class Home extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            name: props.name,
            rest: props.rest,
        }
    }
    public render() {
        return (
            <div>
                <BlockList
                    rest={this.state.rest}
                />
            </div>
        )
    }
}
