import AppError from "../../errorHelpers/appError";
import { IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { createUserTokens } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";



const credentialsLogin = async (payload: Partial<IUser>) => {

    const { email, password } = payload;

    const isUserExit = await User.findOne({ email });

    if (!isUserExit) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExit.password as string);

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }


    // const jwtPayload = {
    //     userId : isUserExit._id,
    //     email: isUserExit.email,
    //     role: isUserExit.role
    // }

    // // const accessToken = jwt.sign(jwtPayload, "secret", {expiresIn: "1d"})
    // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    const userTokens = createUserTokens(isUserExit);

    // delete isUserExit.password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExit.toObject();

    return {
        // email: isUserExit.email
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }


}



const getNewAccessToken = async (refreshToken: string) => {

    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

    const isUserExit = await User.findOne({ email: verifiedRefreshToken.email });

    if (!isUserExit) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
    if (isUserExit.isActive === IsActive.BLOCKED || isUserExit.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExit.isActive}`)
    }
    if (isUserExit.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId : isUserExit._id,
        email: isUserExit.email,
        role: isUserExit.role
    }

    // const accessToken = jwt.sign(jwtPayload, "secret", {expiresIn: "1d"})
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return {
        accessToken,
    }
}




export const AuthServices = {
    credentialsLogin,
    getNewAccessToken
}