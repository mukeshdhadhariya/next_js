import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {usernameValidation} from '@/schemas/signUpSchema'
import {z} from 'zod'

const UsernameQuerySchema=z.object({
    username:usernameValidation
})

export async function GET(request:Request) {

    await dbConnect()

    try {

        const {searchParams}=new URL(request.url)

        const qureyparam={
            username:searchParams.get('username')
        }

        const result=UsernameQuerySchema.safeParse(qureyparam)

        if(!result.success){
            const usernameErrors=result.error.format().username?._errors || []

            return Response.json({
                success:false,
                message:'invalid qurey parameter'
            },{
                status:400
            })
        }

        const {username}=result.data

        const existinguser=await UserModel.findOne({username,isVerified:true})

        if(existinguser){
            return Response.json({
                success:false,
                message:'username alredy taken'
            },{
                status:400
            })
        }

        return Response.json({
            success:true,
            message:'username is unique'
        },{
            status:400
        })
        
    } catch (error) {
        console.error("Error Checking Username ",error)
        return Response.json(
            {
                success:false,
                message:"username checking"
            },{
                status:500
            }
        )
    }
}