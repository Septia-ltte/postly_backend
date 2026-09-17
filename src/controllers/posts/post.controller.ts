import {Request, Response} from "express";
import { createPostSchema, deletePostSchema, updatePostParamSchema, updatePostSchema } from "../../validations/posts.validation";
import { db } from "../../config/db";
import { postsTable } from "../../config/schema";
import { deleteFromCloudinary, uploadToCloudinary } from "../../services/cloudinary.services";
import { desc, eq } from "drizzle-orm";

export class PostController {
    
    createPost = async(req: Request, res: Response)=> {
        try {
            const validateData = createPostSchema.parse(req.body);
            const {categoryId, title, content, status} = validateData;
            const userId = 1; //hanya 1 admin

            let imageUrl: string | undefined;
            let imagePublicId: string | undefined;

            if (req.file) {
                const uploadResult = await uploadToCloudinary(req.file.buffer);
                imageUrl = uploadResult.secure_url;
                imagePublicId = uploadResult.public_id;
            }

            const [insertedPost] = await db.insert(postsTable).values({ userId, categoryId, title, content, status, imageUrl, imagePublicId,})
            .returning();

            // const newPost = await db.query.postsTable.findFirst({where: eq(postsTable.id, insertedPost.id) });

            return res.status(201).json({
                success: true,
                message: "Post created successfully",
                data: {
                    post:insertedPost,
                },
            });

        } catch (error) {
            console.error("Create post error: ", error);
            return res.status(500).json({
                success: false,
                message: "Terjadi kesalan pada server",
                error: error instanceof Error
                    ? error.message
                    : error,
            });
        }
    }

    // //read
    getPosts = async (req: Request, res: Response) => {
        try {
            const posts = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));

            return res.status(200).json({
                succes: true,
                message: "Get post succesfully",
                data: {
                    posts: posts
                }
            })
        } catch (error) {
            console.log("Get post error: ", error);
            return res.status(500).json({
                succes: false,
                message: "Terjadi kesalahan pada server",
                error: error instanceof Error 
                ? error.message 
                : error,
            });
        }
    }

    //update
    updatePost = async (req: Request, res: Response) => {
        try {
            // validate param
            const validatedParams = updatePostParamSchema.parse(req.params);
            const {id} = validatedParams;

            // validate body
            const validateData = updatePostSchema.parse(req.body);
            const {title, content, categoryId} = validateData;

            // cek post
            const [existingPost] = await db
                .select()
                .from(postsTable)
                .where(
                    eq(postsTable.id, id)
                );

            if(!existingPost) {
                return res.status(404).json ({
                    succes: false,
                    message: "Post not found",
                });
            }

            // Siapkan data update
            let imageUrl = existingPost.imageUrl;
            let imagePublicId = existingPost.imagePublicId;

            // jika ada imgae baru
            if (req.file) {
                const uploadResult = await uploadToCloudinary (req.file.buffer);
                imageUrl = uploadResult.secure_url;
                imagePublicId = uploadResult.public_id;

                //hapus image lama
                if (existingPost.imagePublicId) {
                    await deleteFromCloudinary(existingPost.imagePublicId);
                }
            }

            await db 
                .update(postsTable)
                .set ({
                    ...(title !== undefined && {
                        title,
                    }),
                    ...(content !== undefined && {
                        content,
                    }),
                    ...(categoryId !== undefined && {
                        categoryId,
                    }),
                    ...(req.file && {
                        imageUrl,
                        imagePublicId,
                    }),
                })
                .where(
                    eq(postsTable.id, id)
                );

            // ambil data terbaru
            const [updatePost] =
                await db
                    .select()
                    .from(postsTable)
                    .where(
                        eq(postsTable.id, id) // cari post yang idnya sama dngan id
                    );

            //response
            return res.status(200).json({
                succes: true,
                messsage: "Post update succesfully",
                data: {
                    post: updatePost,
                },
            });
            
        } catch (error: any) {
            console.log("Update post error: ", error);
            return res.status(500).json({
                succes: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }

    //delete
    deletePost = async (req: Request, res: Response) => {
        try {
            //validate post id
            const validatedParams = deletePostSchema.parse(req.params);
            const {id} = validatedParams;

            //cek post
            const existingPost = 
                await db.query.postsTable.findFirst({
                    where: eq(postsTable.id, id),
                });
        
            if (!existingPost) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found",
                });
            }

            //soft delete
            await db
                .update(postsTable)
                .set({ status: "deleted"})
                .where(eq(postsTable.id, id));
        
            // response
            return res.status(200).json({
                success: true,
                message: "Post deleted successfully",
            });
        
        } catch (error: any) {
            console.log("Delete post error: ", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }; 
}

export default new PostController();