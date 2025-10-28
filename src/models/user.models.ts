import bcrypt from 'bcrypt';
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUserDocument extends Document, IUser {
  isPasswordCorrect(password: string): Promise<boolean>;
}

export type UserModel = Model<IUserDocument>

interface IUser {
  avatar: {
    localPath: string;
    url: string;
  };
  email: string;
  emailVerificationExpiry?: Date;
  emailVerificationToken?: string;
  forgotPasswordExpiry?: Date;
  forgotPasswordToken?: string;
  fullname: string;
  isEmailVerified: boolean;
  password: string;
  refreshToken?: string;
  username: string;
}

const userSchema = new Schema<IUserDocument, UserModel>(
  {
    avatar: {
      default: {
        localPath: '',
        url: 'https://placehold.co/200x200',
      },
      type: {
        localPath: String,
        url: String,
      },
    },
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    emailVerificationExpiry: Date,
    emailVerificationToken: String,
    forgotPasswordExpiry: Date,
    forgotPasswordToken: String,
    fullname: {
      required: true,
      type: String,
    },
    isEmailVerified: {
      default: false,
      type: Boolean,
    },
    password: {
      required: [true, 'The password is required'],
      type: String,
    },
    refreshToken: String,
    username: {
      index: true,
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const plainPassword = this.password;
  this.password = await bcrypt.hash(plainPassword, 10);

  next();
});


userSchema.methods.isPasswordCorrect = async function (
  this: IUserDocument,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUserDocument, UserModel>('User', userSchema);
