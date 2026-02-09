'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="error-container section-padding text-center">
            <div className="container">
                <h2 className="mb-30">Something went wrong!</h2>
                <p className="mb-30">We apologize for the inconvenience. Please try again.</p>
                <button
                    onClick={reset}
                    className="butn butn-md butn-bord radius-30"
                >
                    <span className="text">Try Again</span>
                </button>
            </div>
            <style jsx>{`
        .error-container {
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
        </div>
    );
}
