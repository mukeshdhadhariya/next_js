import { z } from "zod";

export const usernameValidation=z
      .string()
      .min(2)
      .max(20)
      .regex(/^[a-zA-Z0-9]+$/,"Username must not contain special character")

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email(),
    password:z.string().min(6)
})