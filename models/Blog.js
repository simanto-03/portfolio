import mongoose, { Schema, model, models } from "mongoose";

const contentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Title", "Paragraph", "Image", "Collage", "Code Snippet"],
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
);

const replySchema = new mongoose.Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
});

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: [contentSchema], required: true },
    categories: [{ type: String }],
    coverImage: { type: String },
    comments: [commentSchema],
    preview: { type: String, default: "No Preview" },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
