/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction)=>{

    // console.log(error);

    /**
     * mongoose
     * zod
     */

    /**
     * mongoose
     * - duplicate
     * - cast error
     */



    let statusCode = 500;
    let message = 'Something Went Wrong!!'

    //duplicate error
    if(error.code === 11000){
        // console.log("Duplicate error", error.message);
        const matchedArray = error.message.match(/"([^"]*)"/);
        statusCode= 400;
        message = `${matchedArray[1]} already exists`
    }
    //cast error
    else if(error.name === "CastError"){
        statusCode = 400;
        message = "Invalid mongodb objectId. Please provide a valid id"
    }
    else if(error instanceof AppError){
        statusCode = error.statusCode
        message = error.message
    }
    else if(error instanceof Error){
        statusCode = 500
        message = error.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        error,
        stack: envVars.NODE_ENV === 'development' ? error.stack : null
    })
}