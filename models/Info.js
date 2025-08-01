import mongoose, { Schema, model, models } from "mongoose";

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institute: { type: String, required: true },
  result: { type: String, required: true },
  description: { type: String, required: true },
});

const infoSchema = new Schema(
  {
    intro: {
        type: String, 
        default: "I excel at Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." 
    },
    about: { 
        type: String, 
        default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." 
    },
    education: [educationSchema],
    experience: {type:Number, default: 2},
    tech: {type:Number, default: 2},
  },
  { timestamps: true }
);

const Info = mongoose.models.Info || mongoose.model("Info", infoSchema);

export default Info;
