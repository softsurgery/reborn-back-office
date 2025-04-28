// components/FileUploader.tsx
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/storage/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to upload");

      setUploadedFile(data);
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!uploadedFile?.id) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch(`/api/upload?id=${uploadedFile.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete");

      setUploadedFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-2">File Upload</h2>

      <Input type="file" onChange={handleFileChange} className="border p-2" />

      <div className="space-x-2">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className=" px-4 py-2 rounded"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>

        {uploadedFile && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        )}
      </div>

      {uploadedFile && (
        <div className="mt-4 text-green-600">
          Uploaded: <strong>{uploadedFile.filename}</strong>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          Error: {error}
        </div>
      )}
    </div>
  );
}
