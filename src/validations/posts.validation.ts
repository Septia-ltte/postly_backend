import { z } from "zod";

export const createPostSchema = z.object({
    // userId: z.coerce.number().int().positive(),
    categoryId: z.coerce.number().int().positive(),
    title: z
        .string()
        .min(3, "Title minimal 3 karakter")
        .max(255, "Title maksimal 255 karakter"),
    content: z 
        .string()
        .min(10, "Content minimal 10 karakter,"),
    status: z.enum(["deleted", "published", "draft"])
});

export const updatePostParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const updatePostSchema = z.object({
    // userId: z.coerce.number().int().positive(),
    categoryId: z.coerce.number().int().positive().optional(),
    title: z
        .string()
        .min(3, "Title minimal 3 karakter")
        .max(255, "Title maksimal 255 karakter"),
    content: z 
        .string()
        .min(10, "Content minimal 10 karakter,")
        .optional(),
    status: z.enum(["deleted", "published", "draft"]).optional(),
})

export const deletePostSchema = z.object({
    id: z.coerce.number().int().positive(),
});