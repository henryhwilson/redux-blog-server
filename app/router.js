import { Router } from 'express';
import * as Posts from './controllers/post_controller';

const router = Router();

// router.get('/', (req, res) => {
//   res.json({ message: 'welcome to the blog api!' });
// });

// routes go here

router.route('/posts')
  .post(Posts.createPost)
  .get(Posts.getPosts);

router.route('/posts/:id')
  .get(Posts.getPost)
  .put(Posts.updatePost)
  .delete(Posts.deletePost);

export default router;
