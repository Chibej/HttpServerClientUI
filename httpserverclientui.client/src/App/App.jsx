import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Sidebar from '../Sidebar/Sidebar';
import Canvas from '../Canvas/Canvas';
import LogWindow from '../Log/LogWindow';
import { addLog, handleLog } from '../Log/Log';
import { handleSave, handlePlay, handleStop, handleDiscard, handleLoad } from '../Services/Rest';





const App = () => {
    const [logs, setLogs] = useState([]);
    const [items, setItems] = useState([]);
    const [sidebarWidth, setSidebarWidth] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        handleLog(setLogs);
    }, []);


    useEffect(() => {
        handleLoad(setItems); 
    }, []);



    return (
        <DndProvider backend={HTML5Backend}>
            <div className="app-container">
                <div className="sidebar-canvas-container">
                    <Sidebar
                        ref={sidebarRef}
                        onPlay={() => handlePlay(items, setItems, setIsRunning)}
                        onStop={() => handleStop(items, setIsRunning)}
                        onSave={() => handleSave(items)}
                        onDiscard={() => handleDiscard(setItems, true)}
                        isRunning={isRunning} 
                    />
                    <Canvas sidebarWidth={sidebarWidth} items={items} setItems={setItems} isRunning={isRunning} />
                </div>
                <LogWindow logs={logs} />
            </div>
        </DndProvider>
    );
};

export default App;
