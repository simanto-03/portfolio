import mongoose, { Schema, model, models } from "mongoose";


const publicationSchema = new Schema(
  {
    title: {
        type: String, 
        require: true,
    },
    doi: { 
        type: String, 
    },
    url: {
      type: String,
    },
  },
  { timestamps: true }
);

const Publication = mongoose.models.Publication || model("Publication", publicationSchema);

export default Publication;