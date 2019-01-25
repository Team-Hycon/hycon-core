import * as express from "express"
import { IResponseType } from "../interface/iRestResponse"

export enum RESPONSE_CODE {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    SERVICE_UNAVAILABLE = 503,
}

export function getResponseKey(value: number) {
    return RESPONSE_CODE[value]
}

export class Responser {
    public static checkAndRespondJSON(res: express.Response, data: IResponseType) {
        try {
            res.status(200)
            if ("error" in data) {
                res.status(data.status)
            }
            res.json(data)
            res.end()
        } catch (e) {
            res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            res.json({ error: `${e}` })
            res.end()
        }
    }

    public static responseTemporaryUnavailable(res: express.Response) {
        res.status(503)
        res.json({
            error: "SERVICE_UNAVAILABLE",
            message: "Temporary Unavailable, Please Retry Later.",
            status: 503,
            timestamp: Date.now(),
        })
        res.end()
    }

    public static makeJsonError(status: number, message: string) {
        const error = getResponseKey(status)
        return { status, timestamp: Date.now(), error, message }
    }

    public static invalidParam(param: string = "count") {
        const status = 400
        const error = getResponseKey(status)
        const message = `The parameter value passed as ${param} is invalid.`
        return { status: 400, timestamp: Date.now(), error, message }
    }
    public static missingParameter() {
        const status = 400
        const error = getResponseKey(status)
        const message = "Missing Parameter : The parameters needed to process the request are not defined. Please check the parameters."
        return { status: 400, timestamp: Date.now(), error, message }
    }
}
