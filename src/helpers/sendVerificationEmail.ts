import { resend } from "@/lib/resendEmail";
import VerificationEmail from "../../email/EmailTemplate";
import { apiResponce } from "@/types/apiResponce";
import { promises } from "dns";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<apiResponce> {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to:email,
      subject: "Mystery Message | Verification Code",
      react: VerificationEmail({username,otp:verifyCode}),
    });
    return { success: true, message: "verification email sent successfully" };
  } catch (error) {
    console.log("Error While sending Verification Email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}

