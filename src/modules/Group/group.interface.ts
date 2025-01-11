import { Types } from "mongoose";

export type TGroup = {
    name: string;
    description: string;
    creator: Types.ObjectId;
    members: Types.ObjectId[];
    avatar?: string;
    rules?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  };