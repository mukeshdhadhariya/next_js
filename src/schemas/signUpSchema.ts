import { z } from "zod";

export const usernameValidation=z
      .string()
      .min(5,{ message: "Username must have at least 5 characters" })
      .max(20,{ message: "Username must not exceed 20 characters" })
      .regex(/^[a-zA-Z0-9_-]+$/,"Username must not contain special character")

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email(),
    password:z.string().min(6)
})