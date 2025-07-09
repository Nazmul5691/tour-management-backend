/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from 'http-status-codes'
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response) =>{
    try {
        
        const user = await UserServices.createUser(req.body);

        res.status(httpStatus.CREATED).json({
            message: 'User successfully created',
            user
        })

    } catch (error:any) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).json({
            message: `Something Went Wrong!! ${error.message}`
        })
    }
}


export const UserControllers = {
    createUser
}