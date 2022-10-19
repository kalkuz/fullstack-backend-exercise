import mongoose, { Schema } from 'mongoose';

const BlogSchema = new Schema({
  title: { type: String, required: true },
  author: String,
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

const Blog = mongoose.model('Blogs', BlogSchema);

Blog.createCollection();

export default Blog;
