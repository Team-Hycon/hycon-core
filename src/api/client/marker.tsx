import * as React from "react"

export class Marker extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            text: props.text,
        }
    }

    public render() {
        return <div className="marker">{this.state.text}</div>
    }
}
