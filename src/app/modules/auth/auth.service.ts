/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { createNewAccessTokenWithRefreshToken} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";




// const credentialsLogin = async (payload: Partial<IUser>) => {

//     const { email, password } = payload;

//     const isUserExit = await User.findOne({ email });

//     if (!isUserExit) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
//     }

//     const isPasswordMatch = await bcryptjs.compare(password as string, isUserExit.password as string);

//     if (!isPasswordMatch) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
//     }


//     // const jwtPayload = {
//     //     userId : isUserExit._id,
//     //     email: isUserExit.email,
//     //     role: isUserExit.role
//     // }

//     // // const accessToken = jwt.sign(jwtPayload, "secret", {expiresIn: "1d"})
//     // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

//     // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

//     const userTokens = createUserTokens(isUserExit);

//     // delete isUserExit.password
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: pass, ...rest } = isUserExit.toObject();

//     return {
//         // email: isUserExit.email
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user: rest
//     }


// }


const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }
}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    
    const user = await User.findById(decodedToken.userId)
    
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)

    if(!isOldPasswordMatch){
        throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match")
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save();

}




export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword
}