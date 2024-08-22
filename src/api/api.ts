import request from "./request";

export function getAction(url: string, params: any | undefined) {
    return request(
        {
            url: url,
            headers: {},
            method: 'GET',
            params: params,
        }
    )
}

export function postAction(url: string, params: any | undefined) {
    return request(
        {
            url: url,
            headers: {},
            method: 'POST',
            data: params,
        }
    )
}
