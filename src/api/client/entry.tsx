import getMuiTheme from "material-ui/styles/getMuiTheme"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { BrowserRouter, HashRouter } from "react-router-dom"
import { App } from "./app"
import { RestClient } from "./restClient"

import "material-design-lite"
import "material-design-lite/material.css"
import "./blockexplorer.css"
import "./marker.css"
import "./material.css"
import "./transaction.css"

const rest = new RestClient()

ReactDOM.hydrate(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <BrowserRouter>
            <App rest={rest} />
        </BrowserRouter>
    </MuiThemeProvider>,
    document.getElementById("blockexplorer"),
)
