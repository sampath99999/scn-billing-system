import { z } from "zod";

export const LoginFormSchema = {
    username: z.string({"message": "Username is required"})
        .min(1, { message: "Username is required" })
        .max(50, { message: "Username must be at most 50 characters long" }),
    password: z.string({"message": "Password is required"})
        .min(1, { message: "Password is required" })
        .max(100, { message: "Password must be at most 100 characters long" }),
}
