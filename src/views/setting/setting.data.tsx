const auto = 'data:image/png;base64,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';

const dark = 'data:image/png;base64,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';

const light = 'data:image/png;base64,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';

export {
    auto,
    dark,
    light
}