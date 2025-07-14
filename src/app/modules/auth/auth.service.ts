import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

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


    const jwtPayload = {
        userId : isUserExit._id,
        email: isUserExit.email,
        role: isUserExit.role
    }

    // const accessToken = jwt.sign(jwtPayload, "secret", {expiresIn: "1d"})
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    // delete isUserExit.password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass , ...rest} = isUserExit

    return {
        // email: isUserExit.email
        accessToken,
        refreshToken,
        user: rest
    }


}

export const AuthServices = {
    credentialsLogin
}