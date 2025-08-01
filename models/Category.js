import mongoose, { Schema, model, models } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
