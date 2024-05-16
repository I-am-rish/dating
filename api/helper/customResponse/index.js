

module.exports = {
    // CUSTOM RESPONSE FOR SUCCESS
    success: (res, body={message:"Action completed successfully!"}, statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message: body.message,
            result: body.data
        })
    },

    //CUSTOM RESPONSE FOR ERROR
    error: (res, body={message: "Failed to process request"}, statusCode = 500) => {
        return res.status(statusCode).json({
            success: false,
            message: body.message,
            result: body.data
        })
    },

    // CUSTOM RESPONSE FOR UNAUTHORIZE
    unauthorized: (res, body={message: "You are not authorized to access this resource"}, statusCode = 401) => {
        return res.status(statusCode).json({
            success: false,
            message: body.message,
            result: body.data
        })
    },

}