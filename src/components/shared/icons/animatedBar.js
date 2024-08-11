import React from 'react';

export default function BarIcon({ className }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <style>
                {`
                .spinner {
                    animation: spinner 0.8s linear infinite;
                }
                .spinner:nth-child(1) {
                    animation-delay: -0.8s;
                }
                .spinner:nth-child(2) {
                    animation-delay: -0.65s;
                }
                .spinner:nth-child(3) {
                    animation-delay: -0.5s;
                }
                @keyframes spinner {
                    0%, 100% {
                        opacity: 0.2;
                    }
                    50% {
                        opacity: 1;
                    }
                }
                `}
            </style>
            <circle className={`spinner`} cx="4" cy="12" r="3" />
            <circle className={`spinner`} cx="12" cy="12" r="3" />
            <circle className={`spinner`} cx="20" cy="12" r="3" />
        </svg>
    );
}
