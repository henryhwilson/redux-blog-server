import { Router } from 'express';
import * as Posts from './controllers/post_controller';
// our imports as usual
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';

const router = Router();

// router.get('/', (req, res) => {
//   res.json({ message: 'welcome to the blog api!' });
// });

// routes go here
router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

router.route('/posts')
  .post(requireAuth, Posts.createPost)
  .get(Posts.getPosts);

router.route('/posts/:id')
  .get(Posts.getPost)
  .put(requireAuth, Posts.updatePost)
  .delete(requireAuth, Posts.deletePost);

export default router;
