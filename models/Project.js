import mongoose, { Schema, model, models } from "mongoose";

const contentSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["Title", "Paragraph", "Image", "College", "Code Snippet"],
            required: true,
        },
        content: {
            type: Schema.Types.Mixed,
            required: true,
        },
    },
);

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: [contentSchema], required: true },
    categories: [{ type: String }],
    coverImage: { type: String },
    preview: { type: String, default: "No Preview" },
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
