import { addLog, handleLog } from '../Log/Log';
import { HubConnectionBuilder } from '@microsoft/signalr';

const url = import.meta.env.VITE_BASE_URL;
let connection;

export const handlePlay = async (items, setItems, setIsRunning) => {
    addLog('Starting servers');

    handleSignalR(setItems);

    for (const item of items) {
        if (item.elementType === 'Server') {
            if (!item.address || !item.port) {
                addLog(`Missing address or port for Server ID: ${item.id}`);
                continue;
            }

            try {
                const response = await fetch(`${url}/start-server`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: item.address, port: item.port })
                });

                if (response.ok) {
                    addLog(`Server started at http://${item.address}:${item.port}`);
                } else {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || errorData.detail || 'Failed to start server';
                    addLog(`Failed to start server at http://${item.address}:${item.port}: ${errorMessage}`);
                }
            } catch (error) {
                addLog(`Error starting server at http://${item.address}:${item.port}: ${error.message}`);
            }
        }
    }

    setIsRunning(true);
};


export const handleSignalR = (setItems) => {

    if (connection && connection.state === 'Connected') {
        addLog('SignalR is already connected.');
        return;
    }

    connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_BASE_URL}/canvasHub`, {
            withCredentials: true
        })
        .build(); 

    connection.on('ReceiveServerRequest', (serverAddress, serverPort, message) => {
        const timestamp = new Date().toLocaleString();
        setItems((items) => {
            const updatedItems = items.map(item =>
                item.elementType === 'Server' &&
                item.address === serverAddress &&
                parseInt(item.port) === parseInt(serverPort)
                ? {
                    ...item,
                    request: `${item.request ? item.request + '\n' : ''}${timestamp} ${message}`
                }
                : item
            );
            return [...updatedItems]; 
        });
    });

    connection.start()
        .then(() => addLog('SignalR connected.'))
        .catch(err => addLog(`Error connecting to SignalR: ${err}`));
};

export const handleStop = async (items, setIsRunning) => {
    addLog('Stop button clicked - stopping servers');

    //stop servers
    for (const item of items) {
        if (item.elementType === 'Server') {
            try {
                
                const response = await fetch(`${url}/stop-server`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: item.address, port: item.port })
                });
                if (response.ok) {
                    addLog(`Server stopped at http://${item.address}:${item.port}`);
                } else {
                    addLog(`Failed to stop server at ${item.address}:${item.port}`);
                }
            } catch (error) {
                addLog(`Error stopping server at ${item.address}:${item.port}: ${error.message}`);
            }
        }
    }

    //stop signalR
    if (connection && connection.state === 'Connected') {
        try {
            await connection.stop();
            addLog('SignalR connection stopped.');
        } catch (error) {
            addLog(`Error stopping SignalR connection: ${error.message}`);
        }
    }
    setIsRunning(false);
};

export const handleSave = async (items) => {
    addLog('Clearing old data before saving new items...');

    try {
       
        const clearResponse = await fetch(`${url}/api/Canvas/clear`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!clearResponse.ok) {
            addLog('Failed to clear old settings');
            return; 
        }

        addLog('Old settings cleared successfully, saving new items...');

        const elementsToSave = items.map(item => ({
            id: item.id,
            elementType: item.elementType,
            positionX: item.positionX,
            positionY: item.positionY,
            address: item.address || '',
            port: item.port || 0,
            request: item.request || '',
            body: item.body || '',
            currentCells: JSON.stringify(item.currentCells || []),
            additionalSettings: item.additionalSettings || '',
        }));

        const saveResponse = await fetch(`${url}/api/Canvas/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(elementsToSave),
        });

        if (saveResponse.ok) {
            addLog('Settings saved successfully!');
        } else {
            addLog('Failed to save settings');
        }
    } catch (error) {
        addLog(`Error while saving settings: ${error.message}`);
    }
};

export const handleDiscard = async (setItems) => {
    const confirmDiscard = window.confirm('Are you sure you want to clear your settings? This action cannot be undone.');

    if (confirmDiscard) {
        try {
            const response = await fetch(`${url}/api/Canvas/clear`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setItems([]);
                addLog('Settings cleared successfully!');
            } else {
                addLog('Failed to clear settings');
            }
        } catch (error) {
            addLog('Error while clearing settings', error);
        }
    }
};

export const handleLoad = async (setItems) => {
    try {
        const response = await fetch(`${url}/api/Canvas/load`);
        if (response.ok) {
            const data = await response.json();
            setItems(data); 
            addLog('Loaded canvas items');
        } else {
            addLog('Failed to load canvas items');
        }
    } catch (error) {
        addLog('Error while loading canvas items');
    }
};

export const handleSendMessage = async (address, port, body) => {
    if (!address || !port) {

        addLog(`Missing address or port for Client: ${address}:${port}`);
        return;
    }
    try {
        const headers = { 'Content-Type': 'application/json' };
        const response = await fetch(`${url}/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                address,
                port,
                headers: JSON.stringify(headers),
                body
            })
        });
        if (response.ok) {
            addLog(`Message sent from Client to http://${address}:${port}`);
        } else {
            addLog(`Failed to send message from Client to http://${address}:${port}`);
        }
    } catch (error) {
        addLog(`Error sending message from Client to http://${address}:${port}: ${error.message}`);
    }
};

