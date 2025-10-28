import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
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
    emailVerificationExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
    },
    fullname: {
      required: true,
      type: String,
    },
    isEmailVerified: {
      default: false,
      type: Boolean,
    },
    password: {
      password: [true, 'The password is required'],
      type: String,
    },
    refreshToken: {
      type: String,
    },
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const plainPassword = this.password as string;

  this.password = await bcrypt.hash(plainPassword, 10);

  next();
});

export const User = mongoose.model('User', userSchema);
