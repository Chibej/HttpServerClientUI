import './Sidebar.css';
import React from 'react';
import { useDrag } from 'react-dnd';

const SidebarElement = ({ type, isRunning }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ITEM',
        canDrag: !isRunning, 
        item: {
            id: new Date().getTime(),
            elementType: type,
            address: '',
            port: 0,
            request: '',
            headers: '',
            body: '',
            currentCells: []
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }),
    [isRunning] 
    );



    const getColor = () => {
        if (isRunning) return '#cccccc'; 
        if (type === 'Server') return '#007bff'; 
        if (type === 'Client') return '#ffeb3b'; 
    };

    return (
        <div
            ref={drag}
            className="draggable-item"
            style={{
                margin: '10px 0',
                backgroundColor: isDragging ? '#ddd' : getColor(),
                border: '1px solid #ccc',
                cursor: isRunning ? 'not-allowed' : 'move',
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            <h4>{type}</h4>
        </div>
    );
};

export default SidebarElement;
