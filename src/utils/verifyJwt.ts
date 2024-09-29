import jwt, { JwtPayload } from "jsonwebtoken";
import { USER_ROLE } from "../modules/User/user.constant";
import AppError from "../errors/AppError";


export const createToken = (
    jwtPayload: {
      _id?: string;
      name: string;
      email: string;
      profilePhoto: string;
      role: keyof typeof USER_ROLE;
    },
    secret: string,
    expiresIn: string
  ) => {
    return jwt.sign(jwtPayload, secret, {
      expiresIn,
    });
  };
  
  export const verifyToken = (
    token: string,
    secret: string
  ): JwtPayload | Error => {
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error: any) {
      throw new AppError(401, 'You are not authorized!');
    }
  };