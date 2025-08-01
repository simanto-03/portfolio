import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export default Admin;