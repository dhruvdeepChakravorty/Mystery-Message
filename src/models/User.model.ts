import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  // provides the context of message Recieved and its datatype

  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  // Checks if Datatype received is correct or not

  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isAccepted: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  messages: Message[];
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is Required"],
    trim: true, //removes spaces from username
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email address",
    ], // Will check if Email entered is valid or by using regex, if not message in "" willbe shown, Regex synatx should always be in / ..... /
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  isAccepted: {
    type: Boolean,
    required: true,
    default: true,
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is Required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is Required"],
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  messages: [messageSchema], // Will make a array of messages stored
});

const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema); // First one if the Schema is already made before and will also export with the type saftery of ts , if not second one will make a model with typesafety

export default userModel;
