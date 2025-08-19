import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,code}=await request.json()

        const decodeduser=decodeURIComponent(username)
        const user=await UserModel.findOne({username:decodeduser})
        console.log(user)
        if(!user){
        return Response.json(
            {
                success:false,
                message:"user not found"
            },{
                status:500
            }
        )            
        }

        const isCodeValid=user.verifyCode===code
        const isCodeNotExpire=new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeNotExpire && isCodeValid){
            user.isVerified=true
            await user.save()

            return Response.json(
            {
                success:true,
                message:"account verifyed "
            },{
                status:200
            }
        )

        }else if(!isCodeNotExpire){
            return Response.json(
            {
                success:false,
                message:"code expired"
            },{
                status:500
            }
        )
        }else{
            return Response.json(
            {
                success:false,
                message:"inccorect code"
            },{
                status:400
            }
        )
        }

    } catch (error) {
        console.error("Error verify code ",error)
        return Response.json(
            {
                success:false,
                message:"Error verify code "
            },{
                status:500
            }
        )
    }
}