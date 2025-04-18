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