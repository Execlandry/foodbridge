"use client";

import { useState } from "react";

interface FileUploadResponse {
  id: string;
  name: string;
  mimetype: string;
  storage_unique_name: string;
  size: string;
  url: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  success: boolean;
}

export default function FileUploadPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadResults, setUploadResults] = useState<FileUploadResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("filename", file);
    });

    try {
      const response = await fetch("http://localhost:3008/api/v1/files", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadResults(data);
    } catch (err) {
      setError(
        "Error uploading files: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">File Upload</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isUploading ? "Uploading..." : "Upload Files"}
        </button>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {uploadResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Upload Results</h2>
          <div className="grid gap-4">
            {uploadResults.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-md ${
                  result.success ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <p>
                  <strong>File:</strong> {result.name}
                </p>
                <p>
                  <strong>Type:</strong> {result.mimetype}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {result.success ? "Success" : "Failed"}
                </p>
                {result.url && (
                  <p>
                    <strong>URL:</strong>{" "}
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View File
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
