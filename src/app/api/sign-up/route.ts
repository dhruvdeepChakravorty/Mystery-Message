import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json(); // in nextjs , it is neccessary to await with request
    console.log(username,email,password);
    const existingUserByUsernameAndIsVerified = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserByUsernameAndIsVerified) {
      return Response.json(
        { success: false, message: "Username Already taken" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User Already exist with same email" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1hrs
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Can Change the const expiry date due to new keyword

      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        isAccepted: true,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "User Created Successfully, please Verify" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error Rejistering the user",error);
    return Response.json(
      { success: false, message: "Error Rejistering user" },
      { status: 500 }
    );
  }
}
