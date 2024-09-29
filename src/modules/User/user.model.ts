/* eslint-disable no-useless-escape */
import { Schema, model } from 'mongoose';
import { USER_ROLE } from './user.constant';
import { IUserModel, TUser } from './user.interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser, IUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

userSchema.set('toJSON', {
  //not sending the password field
  transform: (doc, { password, ...rest }, option) => rest,
});

userSchema.statics.isUserExists = async function (email) {
  return await User.findOne({ email });
};

userSchema.statics.isPasswordMatched = async function (
  plainPassword,
  hashPassword,
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};

export const User = model<TUser, IUserModel>('User', userSchema);
