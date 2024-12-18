function BooleanConversions(resp: any) {
    return resp.reduce((acc: Record<string, boolean>, item: any) => {
        Object.entries(item).forEach(([key, value]) => {
            acc[key] = value === 'true';
        });
        return acc;
    }, {});
}

export {
    BooleanConversions
}
