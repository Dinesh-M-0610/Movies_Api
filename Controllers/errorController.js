const CustomError = require("../Utils/CustomError");

const devErrors = (res, error) => {
    res.status(error.statusCode).json({ // ✅ Use statusCode instead of status
        status: error.status, // 'error' or 'fail'
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
};

const handleExpiredJWT = (err) => {
    return new CustomError('JWT has expired. please login again', 401);
}

const handleJWTError = (err) => {
    return new CustomError('Invalid token. Please login again', 401);
}

const prodErrors = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    } else {
        res.status(500).json({ // ✅ Always use a valid HTTP status code
            status: "error",
            message: "Something went wrong! Please try again later"
        });
    }
};


const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}`
    return new CustomError(msg, 400);
}

const duplicateKeyErrorHandler = (err) => {
    const name = err.keyValue.name;
    const msg = `There is already a movie with name ${name}. Please use another Name!`;
    
    return new CustomError(msg, 400)
}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map(val => {val.message});
    const errorMessages = errors.join('. ');
    const msg = `Invalid input data: ${errorMessages}`
    
    return new CustomError(msg, 400);
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500; // Ensure it's a number
    error.status = error.status || "error"; // Just for response JSON, NOT for res.status()

    if (process.env.NODE_ENV === "development") {
        devErrors(res, error);
    } else if (process.env.NODE_ENV === "production") {
        if (error.name === "CastError") error = castErrorHandler(error);
        if (error.code === 11000) error = duplicateKeyErrorHandler(error);
        if (error.name === "ValidationError") error = validationErrorHandler(error);
        if (error.name === "TokenExpiredError") error = handleExpiredJWT(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError(error)

        prodErrors(res, error);
    }
};

