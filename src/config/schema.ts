    import { pgTable, pgEnum, serial, integer, varchar, text, timestamp,} from "drizzle-orm/pg-core";

    export const POST_STATUS = ["deleted", "published", "draft"] as const;

    export const postStatusEnum = pgEnum( "post_status", POST_STATUS);

    // USERS
    export const usersTable = pgTable("users", {
        id: serial("id").primaryKey(),
        username: varchar("username", {length: 50,}).notNull(),
        email: varchar("email", {length: 100,}).notNull().unique(),
        password: varchar("password", {length: 255,}).notNull(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    });

    // CATEGORIES
    export const categoriesTable = pgTable("categories", {
        id: serial("id").primaryKey(),
        name: varchar("name", {length: 100,}).notNull().unique(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    });

    // POSTS
    export const postsTable = pgTable("posts", {
        id: serial("id").primaryKey(),
        userId: integer("user_id").notNull().references(() => usersTable.id, {onDelete: "cascade",}),
        categoryId: integer("category_id").notNull().references(()=> categoriesTable.id, {onDelete: "cascade"}),
        title: varchar("title", {length: 255,}).notNull(),
        content: text("content").notNull(),
        imageUrl: text("image_url"),
        imagePublicId: varchar("image_public_id", {length: 255,}),
        status: postStatusEnum("status").notNull().default("published"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    });