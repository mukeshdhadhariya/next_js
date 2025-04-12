import { sendVerificationEmail } from "@/helpers/SendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,email,password}=await request.json()

        const existingUserVerifiedByUsername=await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is already exist"
            },{
                status:400
            })
        }

        const existingUserByEmail=await UserModel.findOne({email});

        const verifyCode=Math.floor(100000 + Math.random()*900000).toString()

        if(existingUserByEmail){

            if(existingUserByEmail.isVerified){

                return Response.json({
                    success:false,
                    message:" User already exist"
                },{
                    status:400
                })

            }else{

                const hasedPassword=await bcrypt.hash(password,10)

                existingUserByEmail.password=hasedPassword
                existingUserByEmail.verifyCode=verifyCode
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)

                await existingUserByEmail.save()
            }

        }else{

            const hasedPassword=await bcrypt.hash(password,10)

            const expiryDate=new Date()

            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser=new UserModel({
                    username,
                    email,
                    password:hasedPassword,
                    verifyCode,
                    verifyCodeExpiry:expiryDate,
                    isVerified:false,
                    isAcceptingMessage:true,
                    messages:[]
            })

            await newUser.save()
        }

        const emailresponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailresponse){
            return Response.json({
                success:false,
                message:" email response not found "
            },{
                status:500
            })
        }

        return Response.json({
            success:true,
            message:" User registered successfully "
        },{
            status:201
        })

    } catch (error) {
        console.error("Error when Sign-Up ", error)
        return Response.json({
            success:false,
            message:"error sign-up"
        },{
            status:500
        })
    }
}