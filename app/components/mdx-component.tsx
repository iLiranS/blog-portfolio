"use client";
import { useState, useRef } from 'react';

export function TableOfContents({ toc }) {
    if (!toc || toc.length === 0) return null;

    return (
        <nav className="toc">
            <h3>Table of Contents</h3>
            <ul>
                {toc.map((item) => (
                    <li
                        key={item.href}
                        style={{ marginLeft: `${(item.depth - 2) * 20}px` }} // Indent based on depth
                    >
                        <a href={item.href}>{item.value}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}


export function MdxTable(props) {
    return (
        <div className="overflow-x-auto my-8">
            <table className=" divide-y divide-gray-200 border border-gray-200" {...props} />
        </div>
    );
}

export function MdxTh(props) {
    return (
        <th
            className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
            {...props}
        />
    );
}

export function MdxTd(props) {
    return (
        <td
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200"
            {...props}
        />
    );
}


export function Pre({ children, ...props }) {
    const [isCopied, setIsCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    const copyToClipboard = async () => {
        if (!preRef.current) return;

        // textContent gets the raw text, ignoring HTML tags and line numbers (if done via CSS)
        const text = preRef.current.textContent;

        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <div className="relative group my-4">
            {/* The Copy Button */}
            <button
                onClick={copyToClipboard}
                className="
          absolute right-2 top-2 z-10 
          p-2 rounded-md 
          bg-gray-800 hover:bg-gray-700 
          border border-gray-600 
          transition-all
          opacity-0 group-hover:opacity-100 focus:opacity-100 /* Show on hover */
        "
                aria-label="Copy to clipboard"
            >
                {isCopied ? (
                    // Checkmark Icon
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    // Copy Icon
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )}
            </button>

            {/* The Code Block */}
            <pre
                ref={preRef}
                {...props}
                className={`
          bg-[#0d1117] p-4 rounded-lg overflow-x-auto border border-gray-800
          [&>code]:bg-transparent 
                  [&>code[data-line-numbers]]:[counter-reset:line]
        
        /* Style the line numbers */
        [&>code[data-line-numbers]>[data-line]::before]:[counter-increment:line]
        [&>code[data-line-numbers]>[data-line]::before]:[content:counter(line)]
        [&>code[data-line-numbers]>[data-line]::before]:inline-block
        [&>code[data-line-numbers]>[data-line]::before]:w-4
        [&>code[data-line-numbers]>[data-line]::before]:mr-4
        [&>code[data-line-numbers]>[data-line]::before]:text-right
        [&>code[data-line-numbers]>[data-line]::before]:text-gray-500
        
        [&>code>[data-highlighted-line]]:bg-gray-500/30
        [&>code>[data-highlighted-line]]:rounded-md
        `}
            >
                {children}
            </pre>
        </div>
    );
}



export function InlineCode({ children, ...props }) {
    return (
        <code
            {...props}
            className=" bg-gray-700 p-1 text-gray-200  text-sm font-mono"
        >
            {children}
        </code>
    );
}