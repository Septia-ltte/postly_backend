import { Router } from "express";
import CategoryController from "../../controllers/categories/category.controller";

const router = Router();

router.get("/", CategoryController.getCategories);

export default router;