import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) { 
  await dbConnect();
  const session = await getServerSession(authOptions); //It requires Auth options so make auth Options always in different file if session is needed
  const user = session?.user;
  if (!user || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { isAccepted: acceptMessage },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "USer Not found by Id",
        },
        {
          status: 501,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Acceptance updated Successfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error While Updating user accepting messages",
      },
      {
        status: 401,
      }
    );
  }
} // To change IsAccepting message

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions); //It requires Auth options so make auth Options always in different file if session is needed
  const user = session?.user;
  if (!user || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await userModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAccepted,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error Occured to get user accepting message status ",
      },
      {
        status: 500,
      }
    );
  }
} // TO know isAccpetingMessage
