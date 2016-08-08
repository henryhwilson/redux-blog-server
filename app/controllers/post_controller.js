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
  Post.find().sort('-created_at').exec((error, posts) => {
    res.json(posts.map(post => {
      return { id: post._id, title: post.title, tags: post.tags };
    }));
  });
};

export const getPost = (req, res) => {
  // Limits the response to 1 post
  Post.find({ _id: req.params.id }).limit(1).exec((error, posts) => {
    // Retrieve first element in array
    const post = posts[0];
    res.json({ id: post._id, title: post.title, tags: post.tags, content: post.content });
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
