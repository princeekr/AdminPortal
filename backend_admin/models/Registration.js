import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    registration_type: String,
    company: String,
    phone: String,
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("Registration", registrationSchema);
