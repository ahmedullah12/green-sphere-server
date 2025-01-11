import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import mongoose from 'mongoose';
import { TGroup } from './group.interface';
import { Group } from './group.model';
import { Post } from '../Post/post.model';

const createGroup = async (payload: TGroup) => {
  const result = await Group.create({
    ...payload,
    members: [payload.creator],
  });

  return result;
};

const getAllGroups = async (query: Record<string, unknown>) => {
  const groupQuery = new QueryBuilder(
    Group.find().populate('creator members', 'name profilePhoto'),
    query,
  )
    .search(['name', 'description'])
    .sort()
    .filter()
    .paginate();

  const result = await groupQuery.modelQuery;
  return result;
};

const getSingleGroup = async (groupId: string) => {
  const result = await Group.findById(groupId).populate(
    'creator members',
    'name profilePhoto',
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  return result;
};

const joinGroup = async (groupId: string, userId: string) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  const isMember = group.members.map((id) => id.toString()).includes(userId);

  if (isMember) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Already a member');
  }

  group.members.push(new mongoose.Types.ObjectId(userId));
  const result = await group.save();

  return result;
};

const leaveGroup = async (groupId: string, userId: string) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  if (group.creator.toString() === userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Group creator cannot leave');
  }

  group.members = group.members.filter((id) => id.toString() !== userId);
  const result = await group.save();

  return result;
};

const updateGroup = async (
  groupId: string,
  payload: Partial<TGroup>,
  userId: string,
) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  if (group.creator.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only creator can update group');
  }

  const result = await Group.findByIdAndUpdate(groupId, payload, {
    new: true,
  }).populate('creator members', 'name profilePhoto');

  return result;
};

const deleteGroup = async (groupId: string, userId: string) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  }

  if (group.creator.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only creator can delete group');
  }

  // Delete posts of the group
  await Post.deleteMany({ groupId });

  const result = await Group.findByIdAndDelete(groupId);
  return result;
};

const getMyGroups = async (userId: string) => {
  const result = await Group.find({
    members: { $in: [new mongoose.Types.ObjectId(userId)] },
  })
    .populate('creator members', 'name profilePhoto')
    .sort('-createdAt');

  return result;
};

export const GroupServices = {
  createGroup,
  getAllGroups,
  joinGroup,
  leaveGroup,
  updateGroup,
  deleteGroup,
  getMyGroups,
  getSingleGroup,
};
