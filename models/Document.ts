import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true }, // URL of uploaded file
    fileType: { type: String, enum: ["PAN", "Aadhar", "DrivingLicense"], required: true },
    extractedText: { type: String }, // Text extracted from document
    isVerified: { type: Boolean, default: false }, // Verification status
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);
