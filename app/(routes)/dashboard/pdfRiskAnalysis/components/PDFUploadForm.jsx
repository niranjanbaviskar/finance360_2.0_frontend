"use client";
import React, { useState } from 'react';

const PDFUploadForm = ({ onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a PDF file.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // You'll handle the actual API call in the parent component (PDFRiskAnalysisPage)
            onFileUpload(selectedFile);
        } catch (uploadError) {
            setError("Error uploading PDF. Please try again.");
            console.error("Upload Error:", uploadError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={isLoading}>
                {isLoading ? "Uploading..." : "Upload PDF for Analysis"}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default PDFUploadForm;