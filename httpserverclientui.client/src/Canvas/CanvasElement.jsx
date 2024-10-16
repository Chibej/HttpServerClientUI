import './Canvas.css';
import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { addLog } from '../Log/Log';
import { handleSendMessage } from '../Services/Rest';

const CanvasElement = ({ item, itemSizeX, itemSizeY, updateElement, isRunning, handleDelete }) => {
    const [address, setAddress] = useState(item.address || '');
    const [port, setPort] = useState(item.port || 0);
    const [request, setRequest] = useState(item.request || '');
    const [body, setBody] = useState(item.body || '');
    const [isHoveringInput, setIsHoveringInput] = useState(false);

    useEffect(() => {
        if (item) {
            setAddress(item.address || '');
            setPort(item.port || 0);
            setRequest(item.request || '');
            setBody(item.body || '');
        }
    }, [item.id]);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ITEM',
        canDrag: !isRunning && !isHoveringInput,
        item: { ...item },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [isRunning, isHoveringInput]);

    // Prevent dragging when hovering over input fields
    const handleMouseEnter = () => setIsHoveringInput(true);
    const handleMouseLeave = () => setIsHoveringInput(false);

    useEffect(() => {
        updateElement(item.id, {
            address,
            port,
            request,
            body,
        });
    }, [address, port, request, body]);

    const handleClearText = () => {
        setRequest('');
        updateElement(item.id, { request: '' });
    };

    return (
        <div
            ref={drag}
            className={`draggable-canvas-item ${isDragging ? 'dragging' : ''}`}
            style={{
                left: `${item.positionX * (100 / 20)}%`,
                top: `${item.positionY * (100 / 20)}%`,
                width: `${itemSizeX * (100 / 20)}%`,
                height: `${itemSizeY * (100 / 20)}%`,
                backgroundColor: item.elementType === 'Server' ? '#007bff' : '#ffeb3b',
            }}
        >
            <button
                className="delete-button"
                onClick={() => {
                    if (window.confirm('Are you sure you want to delete this element?')) {
                        handleDelete(item);
                    }
                }}
            >
                X
            </button>
            <div className="element">
                <div className="element-title">{item.elementType}</div>

                {item.elementType === 'Server' && (
                    <div className="server-fields">
                        <div className="inline-fields">
                            <label className="address-label">
                                Address:
                                <input
                                    type="text"
                                    className="address-input"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    readOnly={isRunning} 
                                />
                            </label>
                            <label className="port-label">
                                Port:
                                <input
                                    type="number"
                                    className="port-input"
                                    value={port}
                                    onChange={(e) => setPort(e.target.value)}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    readOnly={isRunning} 
                                />
                            </label>
                        </div>

                        <label>
                            Request:
                            <textarea
                                className="large-input"
                                value={request}
                                readOnly
                                rows={5}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            />
                        </label>
                        <button
                            onClick={handleClearText}
                            className="clear-button"
                        >
                            Clear Text
                        </button>
                    </div>
                )}

                {item.elementType === 'Client' && (
                    <div className="client-fields">
                        <div className="inline-fields">
                            <label className="address-label">
                                Address:
                                <input
                                    type="text"
                                    className="address-input"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    readOnly={isRunning} 
                                />
                            </label>
                            <label className="port-label">
                                Port:
                                <input
                                    type="number"
                                    className="port-input"
                                    value={port}
                                    onChange={(e) => setPort(e.target.value)}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    readOnly={isRunning} 
                                />
                            </label>
                        </div>
                        <label>
                            Message:
                            <textarea
                                className="large-input"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                rows={8}
                            ></textarea>
                        </label>
                        <button
                            onClick={() => handleSendMessage(address, port, body)}
                            className="send-button"
                            disabled={!isRunning}
                        >
                            Send Message
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CanvasElement;
