import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true }, // URL of uploaded file
    fileType: { type: String, required: true },
    publicId: { type: String, required: true }, // Cloudinary public ID
    extractedText: { type: String }, // Text extracted from document
    isVerified: { type: Boolean, default: false }, // Verification status
    status: { type: String, enum: ["pending", "processing", "completed", "failed"], default: "pending" },
    verificationDetails: { type: String }, // Details about verification result
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);
