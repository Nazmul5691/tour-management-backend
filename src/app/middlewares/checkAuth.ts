import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";



export const checkAuth = (...authRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No token received");
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload


        // if((verifiedToken as JwtPayload).role !== Role.ADMIN || Role.SUPER_ADMIN){
        // if ((verifiedToken as JwtPayload).role !== Role.ADMIN) {

        // authRoles = ["ADMIN", "SUPER_ADMIN"].includes("ADMIN")

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!!");
        }

        // console.log('token', verifiedToken);
        req.user = verifiedToken;
        next()

    } catch (error) {
        next(error)
    }

}