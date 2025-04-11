import mongoose from "mongoose";

type connectionObject={
    isConnected?:number
}

const connection:connectionObject={}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("database is connected")
        return
    }
    try {

        const db=await mongoose.connect(process.env.MONGODB_URL || '')

        connection.isConnected=db.connections[0].readyState

        console.log("mongodb connected")

    } catch (error) {
        console.log("connection failed ", error)
        process.exit(1)
    }
}

export default dbConnect
