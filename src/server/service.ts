//@ts-ignore
import express from 'express'
import {responseSuccess} from "./utils/responseBody.ts";
import {getApi, start} from "./utils/responseFun.ts";

export function startNodeService() {
    start()
    getApi('/', responseSuccess('hello world'))
}