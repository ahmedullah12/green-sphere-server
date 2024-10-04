/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  role: keyof typeof USER_ROLE;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  isDeleted: boolean;
  isVerified: boolean;
};

export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;
  isUserExistsById(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
};

export type TFollowUser = {
  userId: Types.ObjectId;
  followedUserId: Types.ObjectId;
}
export type TUnfollowUser = {
  userId: Types.ObjectId;
  followedUserId: Types.ObjectId;
}
