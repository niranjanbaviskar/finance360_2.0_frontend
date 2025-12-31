"use client";
import React from 'react';

const RiskAnalysisResults = ({ analysisResults }) => {
    if (!analysisResults) {
        return <p className="text-gray-600 italic">No analysis results yet. Upload a PDF to get started.</p>;
    }

    if (typeof analysisResults === 'string') {
        // Split the string into sections based on double newlines
        const sections = analysisResults.split('\n\n');

        return (
            <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Analysis Results:</h4>
                {sections.map((section, index) => {
                    // Process each section
                    const lines = section.split('\n');
                    const headingLine = lines[0]; // First line is likely the heading (Sample X...)
                    const contentLines = lines.slice(1); // Remaining lines are content

                    // Extract heading text and remove bold markers if present
                    const headingText = headingLine.replace(/\*\*/g, '');

                    return (
                        <div key={index} className="mb-4 p-4 bg-gray-100 rounded-md shadow-sm">
                            {headingText && <h5 className="text-xl font-semibold text-gray-800 mb-2">{headingText}</h5>} {/* Section Heading */}
                            <div className="space-y-2">
                                {contentLines.map((line, lineIndex) => {
                                    if (line.startsWith('* ')) {
                                        // List item - remove the '*' and format as list item
                                        const listItemText = line.substring(2).trim();
                                        // Further formatting for bold within list item
                                        const formattedListItem = listItemText.split('**').reduce((parts, part, partIndex) => {
                                            if (partIndex % 2 === 1) {
                                                parts.push(<strong key={partIndex}>{part}</strong>);
                                            } else {
                                                parts.push(part);
                                            }
                                            return parts;
                                        }, []);
                                        return <p key={lineIndex} className="text-gray-700 list-item">{formattedListItem}</p>; // Use <p> for list item style, adjust with CSS if needed for bullet points
                                    } else {
                                        // Regular paragraph text - format bold parts
                                        const formattedParagraph = line.split('**').reduce((parts, part, partIndex) => {
                                            if (partIndex % 2 === 1) {
                                                parts.push(<strong key={partIndex}>{part}</strong>);
                                            } else {
                                                parts.push(part);
                                            }
                                            return parts;
                                        }, []);
                                        return <p key={lineIndex} className="text-gray-700">{formattedParagraph}</p>;
                                    }
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Array handling (if your API ever returns array of objects) - kept for future compatibility
    if (Array.isArray(analysisResults)) {
        if (analysisResults.length === 0) {
            return <p className="text-gray-600 italic">No significant risks found in the policy based on the analysis.</p>;
        }
        return (
            <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Identified Issues:</h4>
                <ul>
                    {analysisResults.map((result, index) => (
                        <li key={index} className="mb-4 p-4 bg-gray-100 rounded-md shadow-sm">
                            <p><strong className="font-semibold text-gray-800">Issue:</strong> {result.issue || 'N/A'}</p>
                            <p className="text-gray-700"><strong className="font-semibold text-gray-800">Description:</strong> {result.description || 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return <p className="text-gray-600">Unexpected result format received from analysis.</p>;
};

export default RiskAnalysisResults;