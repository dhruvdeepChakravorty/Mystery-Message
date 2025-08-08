import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import { z } from "zod";
import { usernameValidation } from "@/Schemas/signupSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
}); // Will apply all the validations before saving in db

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url); // Get query parameters

    const queryParam = {
      username: searchParams.get("username"), // Extract the "username" query param
    };

    //  Validate using Zod
    const result = usernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid Query Parameters",
          errors: usernameErrors,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400, 
        }
      );
    }

    const { username } = result.data;

    // Check if username exists and is verified
    const existingUserVerified = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerified) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is already taken",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Username is Unique",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error while checking username",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
