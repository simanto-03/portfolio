import mongoose, { Schema } from "mongoose";

const linkSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    logo: { type: String },
});

const contactSchema = new Schema({
    phones: [String],
    emails: [String],
    links: [linkSchema],
}, { timestamps: true });

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);


export default Contact
