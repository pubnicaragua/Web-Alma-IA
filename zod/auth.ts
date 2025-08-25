import { z } from 'zod';

export const AuthLoginSchema = z.object({
    email: z.string().nonempty(),
    password: z.string().nonempty(),
    captcha: z.string().optional(),
    rememberMe: z.boolean().optional(),
});

