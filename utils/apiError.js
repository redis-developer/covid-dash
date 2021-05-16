const { validationResult } = require('express-validator')

const apiError = (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() })
    }
    return next()
}

module.exports = apiError;