/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes'
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";




// const createUserFunction = async (req: Request, res: Response) =>{
//     const user = await UserServices.createUser(req.body);

//         res.status(httpStatus.CREATED).json({
//             message: 'User successfully created',
//             user
//         })
// }


// const createUser = async (req: Request, res: Response, next: NextFunction) =>{
//     try {

//         const user = await UserServices.createUser(req.body);

//         res.status(httpStatus.CREATED).json({
//             message: 'User successfully created',
//             user
//         })

//     } catch (error:any) {
//         console.log(error);
//         next(error)
//     }
// }



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    // res.status(httpStatus.CREATED).json({
    //     message: 'User successfully created',
    //     user
    // })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User successfully created',
        data: user
    })
})


// const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const users = await UserServices.getAllUsers();

//         return users;
//     } catch (error: any) {
//         console.log(error);
//         next(error)
//     }
// }


const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result= await UserServices.getAllUsers();

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: 'All users retrieved successfully',
    //     data: users
    // })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'All users retrieved successfully',
        data: result.data,
        meta: result.meta,
    })
})


export const UserControllers = {
    createUser,
    getAllUsers
}