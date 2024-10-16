let logFunction = null;

export const handleLog = (logFunc) => {
    logFunction = logFunc;
};

export const addLog = (message) => {
    if (logFunction) {
        const formattedMessage = `[${new Date().toLocaleTimeString()}] ${message}`;
        logFunction((prevLogs) => [...prevLogs, formattedMessage]);
    }
};