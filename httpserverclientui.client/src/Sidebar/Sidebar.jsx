import './Sidebar.css';
import React, { forwardRef } from 'react';
import SidebarElement from './SidebarElement';

const Sidebar = forwardRef(({ onPlay, onStop, onSave, onDiscard, isRunning }, ref) => {
    return (
        <div className="sidebar-container" ref={ref}>
            <div className="button-row">
                <button onClick={onPlay} disabled={isRunning}>
                    Play
                </button>
                <button onClick={onStop} disabled={!isRunning}>
                    Stop
                </button>
                <button onClick={onSave} disabled={isRunning}>
                    💾
                </button>
                <button onClick={onDiscard} disabled={isRunning}>
                    ✖
                </button>
            </div>

            <div className="elements-window">
                <h3>Elements</h3>
                <SidebarElement type="Server" isRunning={isRunning} />
                <SidebarElement type="Client" isRunning={isRunning} />
            </div>
        </div>
    );
});

export default Sidebar;
