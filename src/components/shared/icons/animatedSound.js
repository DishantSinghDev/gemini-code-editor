import React from 'react';


export default function SoundIcon({ className, animate = true }) {
    return (
        <svg
            className={className}
            width="10px"
            height="8px"
            viewBox="0 0 10 8"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Sound icon"
            role="img"
        >
            <g
                transform="translate(0.000000, 0.500000)"
                stroke="currentColor"
                strokeWidth="1"
                fillRule="evenodd"
                strokeLinecap="round"
            >
                <line x1="8.5" y1="0.493135" x2="8.5" y2="6.50687">
                    {animate && (
                        <>
                            <animate attributeType="XML" attributeName="y1" values="2;0;2" keyTimes="0;0.5;1" dur=".8s" repeatCount="indefinite" />
                            <animate attributeType="XML" attributeName="y2" values="5;7;5" keyTimes="0;0.5;1" dur=".8s" repeatCount="indefinite" />
                        </>
                    )}
                </line>
                <line x1="6.5" y1="0.789016" x2="6.5" y2="6.21098">
                    {animate && (
                        <>
                            <animate attributeType="XML" attributeName="y1" values="0;2;0" keyTimes="0;0.5;1" dur=".5s" repeatCount="indefinite" />
                            <animate attributeType="XML" attributeName="y2" values="7;5;7" keyTimes="0;0.5;1" dur=".5s" repeatCount="indefinite" />
                        </>
                    )}
                </line>
                <line x1="4.5" y1="1.67582" x2="4.5" y2="5.32418">
                    {animate && (
                        <>
                            <animate attributeType="XML" attributeName="y1" values="1;3;1" keyTimes="0;0.5;1" dur=".6s" repeatCount="indefinite" />
                            <animate attributeType="XML" attributeName="y2" values="6;4;6" keyTimes="0;0.5;1" dur=".6s" repeatCount="indefinite" />
                        </>
                    )}
                </line>
                <line x1="2.5" y1="1.14678" x2="2.5" y2="5.85322">
                    {animate && (
                        <>
                            <animate attributeType="XML" attributeName="y1" values="2;1;2" keyTimes="0;0.5;1" dur=".7s" repeatCount="indefinite" />
                            <animate attributeType="XML" attributeName="y2" values="5;6;5" keyTimes="0;0.5;1" dur=".7s" repeatCount="indefinite" />
                        </>
                    )}
                </line>
                <line x1="0.5" y1="1.67582" x2="0.5" y2="5.32418">
                    {animate && (
                        <>
                            <animate attributeType="XML" attributeName="y1" values="3;0;3" keyTimes="0;0.5;1" dur=".9s" repeatCount="indefinite" />
                            <animate attributeType="XML" attributeName="y2" values="4;7;4" keyTimes="0;0.5;1" dur=".9s" repeatCount="indefinite" />
                        </>
                    )}
                </line>
            </g>
        </svg>
    );
}
