import { z } from 'zod';
import { AuthLoginSchema } from "@/zod/auth";

export type AuthLoginSchemaType = z.infer<typeof AuthLoginSchema>;

export type AuthActionResponse = { data: { token: string } }

