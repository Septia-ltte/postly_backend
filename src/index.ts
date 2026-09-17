import express from 'express';

import postsRouter from './routes/posts/post.route';
import categoriesRouter from './routes/categories/categories.route';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/categories', categoriesRouter);

app.get('/', (req,res) => {
    res.send("Hello World");
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});