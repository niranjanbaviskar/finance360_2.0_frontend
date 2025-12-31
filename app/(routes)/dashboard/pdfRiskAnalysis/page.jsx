"use client";
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

// This component can be in the same file or imported
const RiskAnalysisResults = ({ analysisResults }) => {
    if (!analysisResults) {
        return <p className="text-gray-600 italic">Upload a PDF document to begin the analysis.</p>;
    }
    // Basic formatting for the markdown response from the AI
    return (
        <div className="space-y-4 whitespace-pre-wrap text-sm">
            {analysisResults.split('\n\n').map((section, index) => {
                const parts = section.split('\n');
                const title = parts[0];
                const content = parts.slice(1).join('\n');
                // Don't render the title for the first section (Risk Assessment) as the badge handles it
                if (index === 0) {
                    return <p key={index} className="text-gray-700">{content}</p>;
                }
                return (
                    <div key={index}>
                        <h4 className="text-md font-semibold text-gray-800">{title}</h4>
                        <p className="text-gray-700">{content}</p>
                    </div>
                );
            })}
        </div>
    );
};

// A component for the colored risk badge
const RiskBadge = ({ level }) => {
    const styles = {
        Safe: 'bg-green-100 text-green-800 border-green-300',
        'Caution Advised': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'High-Risk': 'bg-red-100 text-red-800 border-red-300',
    };
    const text = {
        Safe: '✅ Safe',
        'Caution Advised': '⚠️ Caution Advised',
        'High-Risk': '🚨 High-Risk',
    }
    if (!level) return null;
    return (
        <div className={`w-full p-2 mb-4 rounded-lg border text-center font-bold text-lg ${styles[level]}`}>
            {text[level]}
        </div>
    );
};


// Main Page Component
const PDFRiskAnalysisPage = () => {
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [riskLevel, setRiskLevel] = useState(null);
    // NEW: State for copy to clipboard feedback
    const [copySuccess, setCopySuccess] = useState('');


    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    const resetState = () => {
        setAnalysisError(null);
        setAnalysisResults(null);
        setRiskLevel(null);
        setCopySuccess('');
    }

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setUploadedFile(acceptedFiles[0]);
            setUploadedFileName(acceptedFiles[0].name);
            resetState();
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
    });

    const handleSubmitAnalysis = async () => {
        if (!uploadedFile) {
            setAnalysisError("Please upload a PDF file first.");
            return;
        }
        setIsAnalyzing(true);
        resetState();

        try {
            const formData = new FormData();
            formData.append('pdfFile', uploadedFile);

            const response = await fetch(backend_url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Analysis failed.');
            }

            const data = await response.json();
            const summary = data.summary;
            setAnalysisResults(summary);

            const firstLine = summary.split('\n')[0];
            if (firstLine.includes('**Safe**')) setRiskLevel('Safe');
            else if (firstLine.includes('**Caution Advised**')) setRiskLevel('Caution Advised');
            else if (firstLine.includes('**High-Risk**')) setRiskLevel('High-Risk');
            else setRiskLevel(null);

        } catch (error) {
            console.error("Analysis Error:", error);
            setAnalysisError(error.message || "Failed to analyze PDF. Ensure the backend is running.");
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    // NEW: Function to clear the uploaded file and all results
    const handleClear = () => {
        setUploadedFile(null);
        setUploadedFileName('');
        resetState();
    };

    // NEW: Function to copy results text to the clipboard
    const handleCopy = () => {
        if (!analysisResults) return;
        navigator.clipboard.writeText(analysisResults).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }).catch(err => {
            setCopySuccess('Failed to copy.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl p-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                    <span className="text-blue-500">PDF</span> Financial Risk Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side: Upload */}
                    <div className="flex flex-col space-y-4">
                        <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center justify-center">
                                {/* ENHANCED: Display file name and size */}
                                {uploadedFile ? (
                                    <>
                                        <p className="text-lg font-semibold text-blue-600">{uploadedFileName}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                        <p className="text-xs text-gray-400 mt-4">Drag or click to choose a different file</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-500">Drag & drop a PDF here, or click to select</p>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* ENHANCED: Button layout with Clear button */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleSubmitAnalysis}
                                disabled={!uploadedFile || isAnalyzing}
                                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            >
                                {isAnalyzing ? 'Analyzing...' : 'Analyze PDF'}
                            </button>
                            {uploadedFile && (
                                <button
                                    onClick={handleClear}
                                    disabled={isAnalyzing}
                                    className="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                         {/* ENHANCED: More prominent error display */}
                        {analysisError && (
                            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-md flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                <p className="text-sm">{analysisError}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Results */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-inner flex flex-col">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-2xl font-semibold text-gray-700">Analysis Results</h3>
                            {/* NEW: Copy to clipboard button */}
                            {analysisResults && (
                                <div className="relative">
                                    <button onClick={handleCopy} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300">Copy</button>
                                    {copySuccess && <span className="absolute -top-6 right-0 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">{copySuccess}</span>}
                                </div>
                            )}
                        </div>
                        
                        <RiskBadge level={riskLevel} />

                        <div className="overflow-auto h-80 flex-grow">
                             {/* ENHANCED: Loading state with a spinner */}
                            {isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <p>AI is analyzing the document...</p>
                                    <p className="text-xs mt-1">This may take a moment.</p>
                                </div>
                            ) : (
                                <RiskAnalysisResults analysisResults={analysisResults} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFRiskAnalysisPage;