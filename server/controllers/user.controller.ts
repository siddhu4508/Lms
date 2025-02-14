require ('dotenv').config();
import {Request, Response, NextFunction} from "express";
import userModel from "../models/user.models";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";

// register user

interface IRegistrationBody{
    name: string;
    email: string;
    password: string;
    avatar?: string;
}


export const registrationUser = CatchAsyncError(async (req:Request, res:Response,next:NextFunction) => {
    try {
        const { name, email, password} = req.body;

        const isEmailExist = await userModel.findOne({email});
        if(isEmailExist){
            return next(new ErrorHandler("Email already exists", 400))
        };
        const user:IRegistrationBody = {
            name,
            email,
            password
        };
        const activationToken = createActivationToken(user);

        const activationCode = activationToken.activationCode;
        const data = {user: {name:user.name}, activationCode};
        const html = await ejs.renderFile(path.join(__dirname,""

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

interface IActivationToken {
    token: string;
    activationCode: string;
};


export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(Math.random() * 900000).toString();

    const token = jwt.sign({
        user, activationCode
    },process.env.ACTIVATION_SECRET as Secret ,{
        expiresIn: "5m",
    });

    return {token, activationCode};

};
