import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';

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

    return {
        email: isUserExit.email
    }


}

export const AuthServices = {
    credentialsLogin
}