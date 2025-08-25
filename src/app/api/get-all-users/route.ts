import { NextResponse } from "next/server";
import mongoose from "mongoose";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";


export async function GET(req: Request) {
  await dbConnect()
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const users = await UserModel.find()
    .skip(skip)
    .limit(limit)
    .select("_id username email isAcceptingMessages"); 

    const total = await UserModel.countDocuments();



    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}