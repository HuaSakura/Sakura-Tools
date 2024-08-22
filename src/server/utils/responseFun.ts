//@ts-ignore
import express from 'express';
//@ts-ignore
import cors from 'cors';
import {storeGet} from "../../utils/store.ts";


const app = express();
app.use(cors())

const port: any = storeGet('port')

function start() {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

function getApi(path: string, data: any) {
    app.get(path, (_req: any, res: any) => {
        res.send(data)
    })
}

function postApi(path: string, data: any) {
    app.post(path, (_req: any, res: any) => {
        res.send(data)
    })
}

function putApi(path: string, data: any) {
    app.put(path, (_req: any, res: any) => {
        res.send(data)
    })
}

function deleteApi(path: string, data: any) {
    app.delete(path, (_req: any, res: any) => {
        res.send(data)
    })
}

export {
    start,
    getApi,
    postApi,
    putApi,
    deleteApi
}