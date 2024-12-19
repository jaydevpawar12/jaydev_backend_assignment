const validator = require("validator")

exports.checkEmpty = (config) => {
    const error = {}
    let isError = false
    for (const item in config) {
        if (!config[item]) {
            error[item] = `${item} Is Required`
            isError = true
        } else if (validator.isEmpty("" + config[item] || "")) {
            error[item] = `${item} Is Required`
            isError = true
        }
    }
    return { isError, error }
} 