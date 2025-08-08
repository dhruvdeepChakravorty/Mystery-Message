import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import { Message } from "@/models/User.model";

export async function POST(request:Request) {
    await dbConnect();
    const {content,username} = await request.json()

  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return Response.json(
          {
            success: false,
            message: "User not found",
          },
          {
            status: 400,
          }
        );
    }
    // User Turned off Accepting messages
    if (!user.isAccepted) {
      return Response.json(
          {
            success: false,
            message: "User not Accepting Messages",
          },
          {
            status: 401,
          }
        );
    }
  
   const newMessages = {content,createdAt:new Date()}
   user.messages.push(newMessages as Message) // asserting that datatype will always be correct
   await user.save()
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error)
    return Response.json(
        {
          success: false,
          message: "Error Occured while sending messages",
        },
        {
          status: 500,
        }
      );
  }
}