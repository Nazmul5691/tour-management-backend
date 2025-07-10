import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes'


// const createUser = async (payload: Partial<IUser>) =>{

//     const {name, email}  = payload;

//         const user = await User.create({
//             name, 
//             email
//         })

//         return user;
// }

const createUser = async (payload: Partial<IUser>) => {

    const { email, ...rest } = payload;

    const isUserExit = await User.findOne({email});

    if(isUserExit){
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const authProvider: IAuthProvider = {provider: "credentials", providerId: email as string}

    const user = await User.create({
        email,
        auths: [authProvider],
        ...rest
    })

    return user;
}

const getAllUsers = async () => {
    const users = await User.find();

    const totalUsers = await User.countDocuments()

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
}



export const UserServices = {
    createUser,
    getAllUsers
}