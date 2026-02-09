import React from 'react';

export default function Loading() {
    return (
        <div className="loader-wrap-modern">
            <style>{`
         .loader-wrap-modern {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100vh;
            background: #1d1d1d;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
         }
         .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: #fd5b38;
            border-radius: 50%;
            animation: spin 1s linear infinite;
         }
         @keyframes spin {
            to { transform: rotate(360deg); }
         }
       `}</style>
            <div className="spinner"></div>
        </div>
    );
}
