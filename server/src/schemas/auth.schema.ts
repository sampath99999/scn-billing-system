import { z } from "zod";

const loginSchema = z.object({
    username: z.string({message: 'Username is required'}).min(1, "Username is required").max(25, "Username must be less than 25 characters"),
    password: z.string({message: 'Password is required'}).min(1, "Password is required").max(50, "Password must be less than 25 characters"),
    remember: z.boolean().optional(),
});

const authSchema = {
    loginSchema,
}

export default authSchema;
