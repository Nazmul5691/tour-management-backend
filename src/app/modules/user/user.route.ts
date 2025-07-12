
import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { Role } from "./user.interface";


const router = Router();


router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser);
router.get("/all-users", (req: Request, res: Response, next: NextFunction)=>{

    try {
        const accessToken = req.headers.authorization;

        if(!accessToken){
            throw new AppError(403, "No token received"); 
        }

        const verifiedTOken = jwt.verify(accessToken, "secret");

        // if(!verifiedTOken){
        //      throw new AppError(403, "You are not authorized"); 
        // }

        if((verifiedTOken as JwtPayload).role !== Role.ADMIN || Role.SUPER_ADMIN){
            throw new AppError(403, "You are not permitted to view this route!!!"); 
        }

        console.log('token',verifiedTOken);

        next()

    } catch (error) {
        next(error)
    }

}, UserControllers.getAllUsers);


export const UserRoutes = router