import z from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().pipe(z.email()),
  password: z.string().trim().min(6),
});

export type RegisterDto = z.infer<typeof registerSchema>;
