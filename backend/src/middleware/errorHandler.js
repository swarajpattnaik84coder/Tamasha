import {apiError} from "../utils/apiError.js"

const notFound = (req,res,next)=>{
    const e = new apiError(
        404,
        `route ${req.originalUrl} not found`
    )
    next(e)
}

const errorHandler = (error,req,res,next)=>{


    // Convert non-apiError (e.g. DB errors) into apiError

    if(!(error instanceof apiError)){
        let statusCode = 500; 
        
        let message = "internal server error";

        if(error.code === "23505"){
            //postgres unique constraint
            statusCode = 409;
            message = "resource already exists";
        }
        if (error.type === "entity.parse.failed") {
        statusCode = 400;
        message = "Invalid JSON in request body";
        }
        
        if(statusCode == 500){console.log(error);}
        
        error = new apiError(
            statusCode,
            message,
            [],
            error.stack
        );
        
    }

    return res.status(error.statusCode).json({
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
        data: null  
    })
}
export {notFound, errorHandler}