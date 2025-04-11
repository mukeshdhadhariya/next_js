import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponce } from "@/types/ApiRespoce";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponce>{
    try {
        await resend.emails.send({
            from:'',
            to:email,
            subject:"mstrymsg Verification code",
            react:VerificationEmail({username,otp:verifyCode}),
        });

        return {success:true,message:"send email successfully"}

    } catch (error) {
        console.error("Error while Sending emails ",error)
        return {success:false,message:"sending email failed"}
    }
}