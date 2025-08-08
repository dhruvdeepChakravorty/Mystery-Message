import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, code } = await request.json(); 
    const decodedUsername = decodeURIComponent(username);

    const user = await userModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification code",
        },
        { status: 400 }
      );
    }

    if (isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification Code expired, Please sign up again",
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Account verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error verifying code",
      },
      { status: 500 }
    );
  }
}
