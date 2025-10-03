import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
export const UserSchema = z.object({
  id: z.string().uuid().default(uuidv4),
  email: z.string().email(),
  Firstname: z.string().min(2).max(100),
    Lastname: z.string().min(2).max(100),
  age: z.number().min(0).optional(),
  password: z.string().min(6).max(100),
});

export type User = z.infer<typeof UserSchema>;

export const RegisterUserSchema = UserSchema.omit({ id: true });
export type RegisterUser = z.infer<typeof RegisterUserSchema>;

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;

export const UpdateUserSchema = UserSchema.partial().omit({ id: true });
export type UpdateUser = z.infer<typeof UpdateUserSchema>;