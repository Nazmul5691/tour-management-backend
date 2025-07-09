/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction)=>{

    const statusCode = 500;
    const message = `Something Went Wrong!! ${error.message} formmmmm`

    res.status(statusCode).json({
        success: false,
        message,
        error,
        stack: envVars.NODE_ENV === 'development' ? error.stack : null
    })
}