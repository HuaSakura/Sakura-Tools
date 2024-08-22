function responseSuccess(data: any) {
    return {
        code: 200,
        data: data,
        msg: "success",
        isSuccess: true
    }
}

function responseError(msg: string) {
    return {
        code: 500,
        data: null,
        msg: msg,
        isSuccess: false
    }
}

function responseBody(data: any, msg: string, type: boolean) {
    return {
        code: 200,
        data: data,
        msg: msg,
        isSuccess: type
    }
}

export {
    responseSuccess,
    responseError,
    responseBody
}