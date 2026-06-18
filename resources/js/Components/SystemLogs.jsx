import React, { useState, useEffect } from 'react';

const LOG_MESSAGES = [
    "INITIALIZING KERNEL...",
    "MOUNTING /dev/sda1...",
    "ESTABLISHING SECURE CONNECTION...",
    "ENCRYPTING DATA STREAM...",
    "BYPASSING FIREWALL...",
    "ACCESS GRANTED",
    "UPLINK STABLE: 10Gbps",
    "DECRYPTING ARCHIVE_IDENTITAS...",
    "SCANNING FOR THREATS...",
    "0 THREATS DETECTED",
];

export default function SystemLogs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(prev => {
                const next = [...prev, LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]];
                return next.slice(-8); // Keep last 8 logs
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-terminal-muted/30 p-2 border border-terminal text-[10px] font-mono h-32 overflow-hidden">
            <div className="text-terminal-primary mb-1 border-b border-terminal pb-1 uppercase tracking-tighter">System Logs</div>
            {logs.map((log, i) => (
                <div key={i} className="text-gray-500">
                    <span className="text-terminal-primary">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
            ))}
        </div>
    );
}
