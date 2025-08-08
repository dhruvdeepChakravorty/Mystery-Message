import { z } from "zod";
//to validate the username string
export const usernameValidation = z
  .string()
  .min(3, "Username must be atleast 3 character")
  .max(10, "Username must be not longer than 10 character")
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    "Usernmae must not contain any special character"
  );
// to calidate the signup Schema
export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password must be atleast 4 character" }),
});
