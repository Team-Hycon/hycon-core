import getMuiTheme from "material-ui/styles/getMuiTheme"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import * as React from "react"
import { ReactElement } from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router"
import { App } from "../client/app"
import { RestServer } from "./restServer"
export function indexRender(
    rest: RestServer,
    url: string,
    context: any,
): string {
    const render = renderToString(
        <MuiThemeProvider muiTheme={getMuiTheme({ userAgent: (typeof navigator !== "undefined" && navigator.userAgent) || "all" })}>
            <StaticRouter location={url} context={context}>
                <App rest={rest} />
            </StaticRouter>
        </MuiThemeProvider>,
    )
    const html = `
        <!doctype html>
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>Hycon Block Explorer</title>
                <script src="/react/umd/react.development.js"></script>
                <script src="/react-dom/umd/react-dom.development.js"></script>
                <script src="/react-router/umd/react-router.js"></script>
                <script src="/react-router-config/umd/react-router-config.js"></script>
                <script src="/react-router-dom/umd/react-router-dom.js"></script>
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="/styles.css" type="text/css">
            </head>
            <body>
                <div id="blockexplorer">${render}</div>
                <script src="/bundle.js"></script>
            </body>
        </html>
    `
    return html
}
