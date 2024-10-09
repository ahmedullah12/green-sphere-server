import mongoose from 'mongoose';
import { TFollowUser, TUnfollowUser, TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const getUser = async (id: string) => {
  const result = await User.findById(id)
    .populate('followers')
    .populate('following');

  return result;
};

const updateProfile = async (id: string, payload: Partial<TUser>) => {
  const user = await User.findById(id);
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const followUser = async (payload: TFollowUser) => {
  const { userId, followedUserId } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //update the followed user
    await User.findByIdAndUpdate(
      followedUserId,
      { $addToSet: { followers: userId } },
      { new: true, session },
    );

    // Update the user
    const result = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: followedUserId } },
      { new: true, session },
    );

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const unfollowUser = async (payload: TUnfollowUser) => {
  const { userId, followedUserId } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Update the followedUser by removing userId from followers array
    await User.findByIdAndUpdate(
      followedUserId,
      { $pull: { followers: userId } },
      { new: true, session },
    );

    // Update the user by removing followedUserId from following array
    const result = await User.findByIdAndUpdate(
      userId,
      { $pull: { following: followedUserId } },
      { new: true, session },
    );

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error: any) {
    // Abort the transaction if any error occurs
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const UserService = {
  getUser,
  updateProfile,
  followUser,
  unfollowUser,
};
