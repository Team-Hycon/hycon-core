import * as express from "express"
export function getAPIPath(restRouter: IRestRouter) {
    return `/api/${restRouter.version}/${restRouter.rootPath}`
}

export interface IRestRouter {
    readonly version: string
    readonly rootPath: string
    routeRest(): void
    getRouter(): express.Router
}
