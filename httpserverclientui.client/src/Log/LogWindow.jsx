import './Log.css';
import React, { useEffect, useRef } from 'react';

const LogWindow = ({ logs }) => {
    const logEndRef = useRef(null); 

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
    }, [logs]); 

    return (
        <div className="log-window">
            <h4>Logs</h4>
            <div className="log-content">
                {logs.length === 0 ? (
                    <p>No logs yet...</p>
                ) : (
                    logs.map((log, index) => <div key={index}>{log}</div>)
                )}
                {}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};

export default LogWindow;
