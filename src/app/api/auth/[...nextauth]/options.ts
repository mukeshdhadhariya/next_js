import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

interface ReturnUser {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}


export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({

            id: "credentials",
            name: "credentials",
            credentials:{
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials:any):Promise<any>{

                await dbConnect()

                try {

                    const user=await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error('no user found with this email')
                    }

                    if(!user.isVerified){
                        throw new Error('please verify your account')
                    }

                    const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)

                    if(isPasswordCorrect){

                        const return_user:ReturnUser={
                            _id: String(user._id),
                            username: user.username,
                            email: user.email,
                            isVerified: user.isVerified,
                            isAcceptingMessages: user.isAcceptingMessages,
                        }

                        return return_user;
                        
                    }else{
                        throw new Error('user incorrect password')
                    }
                    
                }catch (err:any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
        async session({ session,token }) {
            if(token){
                session.user._id=token._id
                session.user.isVerified=token.isVerified
                session.user.isAcceptingMessages=token.isAcceptingMessages
                session.user.username=token.username
            }
            return session
        },
        async jwt({ token, user }) {
            if(user){
                token._id=user._id?.toString()
                token.isVerified=user.isVerified
                token.isAcceptingMessages=user.isAcceptingMessages
                token.username=user.username
            }
            return token
        }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXT_AUTH_SECRET,
}