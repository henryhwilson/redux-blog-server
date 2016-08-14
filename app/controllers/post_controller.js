import Post from '../models/post_model';

const cleanTitle = (title) => {
  if (title === '') {
    return 'Untitled';
  } else {
    return title;
  }
};

export const createPost = (req, res) => {
  console.log('Creating post..');
  const post = new Post();
  post.title = cleanTitle(req.body.title);
  post.tags = req.body.tags;
  post.content = req.body.content;
  post.author = req.user._id;
  post.save()
  .then(result => {
    console.log(post);
    res.json({ message: 'Post created!' });
  })
  .catch(error => {
    console.log(error);
    res.json({ error });
  });
};

export const getPosts = (req, res) => {
  console.log('Getting posts');
  Post.find()
  .sort('-created_at')
  .populate('author')
  .exec((error, posts) => {
    res.json(posts.map(post => {
      if (post.author) {
        return { id: post._id, title: post.title, tags: post.tags, author: post.author.full_name };
      } else {
        return { id: post._id, title: post.title, tags: post.tags, author: 'Anonymous' };
      }
    }));
  });
};

export const getPost = (req, res) => {
  // Limits the response to 1 post
  Post.findOne({ _id: req.params.id }).populate('author').exec((error, post) => {
    if (post) {
      if (post.author) {
        res.json({ id: post._id, title: post.title, tags: post.tags, content: post.content, author: post.author.full_name });
      } else {
        res.json({ id: post._id, title: post.title, tags: post.tags, content: post.content, author: 'Anonymous' });
      }
    } else {
      res.json(error);
    }
  });
};

export const deletePost = (req, res) => {
  console.log('Removing post...');
  Post.remove({ _id: req.params.id }, (error, posts) => {
    if (error === null) {
      res.json({ message: 'Post deleted!' });
    } else {
      res.json({ error });
    }
  });
};

export const updatePost = (req, res) => {
  console.log('Updating with info');
  console.log(req.body);
  Post.update({ _id: req.params.id }, { title: cleanTitle(req.body.title), tags: req.body.tags, content: req.body.content }, {}, (error, raw) => {
    if (error === null) {
      res.json({ message: 'Post updated!' });
    } else {
      res.json({ error });
    }
  });
};
