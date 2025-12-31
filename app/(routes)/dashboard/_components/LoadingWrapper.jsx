import React, { useState, useEffect } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

function LoadingWrapper({ children }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay (replace with actual data fetching if needed)
        setTimeout(() => {
            setLoading(false);
        }, 1000); // Increased delay for loader to be visible
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-50 h-screen flex justify-center items-center">
                <ClimbingBoxLoader color="#3b82f6" loading={loading} size={30} />
            </div>
        );
    }

    return children;
}

export default LoadingWrapper;