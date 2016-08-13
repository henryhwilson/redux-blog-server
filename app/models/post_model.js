import mongoose, { Schema } from 'mongoose';

// new schema, posts w/ field
const PostSchema = new Schema({
  title: { type: String, default: 'Untitled' },
  tags: String,
  content: String,
  created_at: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

// create a class for the model
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
