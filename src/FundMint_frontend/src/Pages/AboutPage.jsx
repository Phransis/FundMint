import React, { useState } from "react";
import { FundMint_backend } from "../../../declarations/FundMint_backend";

function AboutPage() {
  const CHUNK_SIZE = 1024 * 1024; // 1MB
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [fileInfo, setFileInfo] = useState(null);

  const uploadImage = async (file) => {
    setFileInfo(file);
    setUploading(true);
    setStatus("⏳ Uploading...");
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    // Simulate chunk upload progress
    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await chunk.arrayBuffer(); // simulate reading
      setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const blobBytes = Array.from(new Uint8Array(arrayBuffer)); // Vec<u8>

        const result = await FundMint_backend.uploadImage(file.name, blobBytes);
        console.log("✅ Upload success:", result);
        setStatus("✅ Upload complete!");
      } catch (err) {
        console.error("❌ Upload failed:", err);
        setStatus("❌ Upload failed.");
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setStatus("❌ Failed to read file.");
      setUploading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            uploadImage(file);
          }
        }}
        disabled={uploading}
        className="mb-4"
      />

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <p className="text-gray-700">{status}</p>
      <p className="text-sm text-gray-500">
        Upload Progress: {uploadProgress}%
      </p>
      <p className="text-sm text-gray-500">
        Uploading: {uploading ? "Yes" : "No"}
      </p>

      {/* Display file information if available */}
      {fileInfo && (
        <div className="mt-4 text-sm text-gray-700 space-y-1">
          <p>
            <strong>File Name:</strong> {fileInfo.name}
          </p>
          <p>
            <strong>File Size:</strong> {(fileInfo.size / (1024*1024)).toFixed(2)} MB
          </p>
          <p>
            <strong>File Type:</strong> {fileInfo.type}
          </p>
          <p>
            <strong>Last Modified:</strong> {fileInfo.lastModified}
          </p>
          <p>
            <strong>Last Modified Date:</strong>{" "}
            {fileInfo.lastModifiedDate?.toString()}
          </p>
          <p>
            <strong>Relative Path:</strong>{" "}
            {fileInfo.webkitRelativePath || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}

export default AboutPage;
