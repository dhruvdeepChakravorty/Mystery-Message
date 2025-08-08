import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
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

    const userId = new mongoose.Types.ObjectId(user._id); // In agregation it is necessary to tell mongoose the type of object, it creates error if we use direct id as it is in string
   try {

    const user = await userModel.aggregate(
        [
            {$match:{ _id: userId }}, // Correct field for matching by ObjectId
            {$unwind:"$messages"}, // Will unwind the array of message into a object which makes it easier for use, always use string to get a internal parametre from mongoose
            {$sort:{"messages.createdAt":-1}},// Used to sort document based on a single parametre
            {$group:{_id:'$_id',messages:{$push:"$messages"}}}, // Will groop all the messages with parametre of id and all the sorted messages, only the message that user have will be pushed into the single variable

        ])

        if (!user || user.length ===0) {
            return Response.json(
                {
                  success: false,
                  message: "User Not found",
                },
                {
                  status: 400,
                }
              );
        }

        return Response.json(
            {
              success: true,
              message: user[0].messages, // aggeration returns a array and we can get the messages from its 0 index
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
          message: "Error while getting message",
        },
        {
          status: 500,
        }
      );
   }

  } 

