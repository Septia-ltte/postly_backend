import { Router } from "express";
import { uploadSingleImage } from "../../middleware/upload.middleware";
import PostController from "../../controllers/posts/post.controller";
import postController from "../../controllers/posts/post.controller";

const router = Router();

router.post('/', uploadSingleImage, PostController.createPost);
router.get('/', PostController.getPosts);
router.patch('/:id',uploadSingleImage, PostController.updatePost);
router.delete('/:id', postController.deletePost);
export default router;