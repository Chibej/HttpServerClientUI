import './Canvas.css';
import React, { useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import CanvasElement from './CanvasElement';
import { addLog, handleLog } from '../Log/Log';

const gridSize = 20; // Define grid size 
const itemSizeX = 5; // Elements X size
const itemSizeY = 6; // Elements Y size

const Canvas = ({ sidebarWidth, items, setItems, isRunning }) => {
    const [highlightedCells, setHighlightedCells] = useState([]); 
    const [occupiedCells, setOccupiedCells] = useState([]); 
    const occupiedCellsRef = useRef([]); 
    const itemsRef = useRef(items);
    const overlapDetectedRef = useRef(false); 

    //to get current cells on canvas when dragging
    useEffect(() => {
        occupiedCellsRef.current = occupiedCells;
    }, [occupiedCells]);

    //to get current item when dragging
    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    useEffect(() => {
        const occupiedCellsArray = [];
        items.forEach(item => {
            for (let rowOffset = 0; rowOffset < itemSizeY; rowOffset++) {
                for (let colOffset = 0; colOffset < itemSizeX; colOffset++) {
                    const currentCell = (item.positionY + rowOffset) * gridSize + (item.positionX + colOffset);
                    occupiedCellsArray.push(currentCell);
                }
            }
        });
        setOccupiedCells(occupiedCellsArray);
    }, [items]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'ITEM',
        drop: (item, monitor) => {
            const clientOffset = monitor.getClientOffset();
            dragElement(item, clientOffset, 'drop');
        },
        hover: (item, monitor) => {
            const clientOffset = monitor.getClientOffset();
            dragElement(item, clientOffset, 'hover');
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    //calculations when dragging Element
    const dragElement = (item, coordinates, action) => {
        const canvas = document.querySelector('.canvas');
        const canvasRect = canvas.getBoundingClientRect();

        const { adjustedX, adjustedY } = adjustCoordinates(coordinates, canvasRect);
        const { snappedX, snappedY } = snapToGrid(adjustedX, adjustedY);

        if (!isWithinBounds(snappedX, snappedY, itemSizeX, itemSizeY, gridSize)) {
            if (action === 'hover') setHighlightedCells([]);
            if (action === 'drop') addLog(`Element cannot be dropped outside of the grid.`);
            if (action === 'hover') return true;
            return false;

        }

        const newCurrentCells = calculateCells(snappedX, snappedY);
        const existingItem = itemsRef.current.find(i => i.id === item.id);
        const currentItemCells = existingItem ? existingItem.currentCells || [] : [];

        //check if it's overlapping but not with itself
        const overlapDetected = newCurrentCells.some(
            cellIndex =>
                occupiedCellsRef.current.includes(cellIndex) &&
                !currentItemCells.includes(cellIndex)
        );

        if (action === 'hover') {
            setHighlightedCells(newCurrentCells);
            overlapDetectedRef.current = overlapDetected;
            return overlapDetected;
        }

        if (overlapDetected) {
            setHighlightedCells([]);
            addLog(`${item.elementType} cannot be placed due to overlap.`);
            return;
        }

        dropElement(item, snappedX, snappedY, newCurrentCells);
    };

    //drop element on calculated position
    const dropElement = (item, snappedX, snappedY, newCurrentCells) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);

            if (existingItem) {
                return prevItems.map(i => {
                    if (i.id === item.id) {
                        return {
                            ...i,
                            positionX: snappedX,
                            positionY: snappedY,
                            currentCells: newCurrentCells
                        };
                    }
                    return i;
                });
            } else {
                const newItem = {
                    ...item,
                    positionX: snappedX,
                    positionY: snappedY,
                    id: new Date().getTime(),
                    currentCells: newCurrentCells,
                };
                return [...prevItems, newItem];
            }
        });
        addLog(`${item.elementType} dropped at (row: ${snappedY}, column: ${snappedX}).`);
    };

    //calculate coordinates based on canvas
    const adjustCoordinates = (coordinates, canvasLayout) => {
        const adjustedX = coordinates.x - canvasLayout.left;
        const adjustedY = coordinates.y - canvasLayout.top;
        return { adjustedX, adjustedY };
    };

    //check if dragged Element is within bounds of calculated Cells
    const isWithinBounds = (snappedX, snappedY, itemSizeX, itemSizeY, gridSize) => {
        return (
            snappedX >= 0 &&
            snappedY >= 0 &&
            snappedX + itemSizeX <= gridSize &&
            snappedY + itemSizeY <= gridSize
        );
    };

    //snapp cells to grid
    const snapToGrid = (x, y) => {
        const canvas = document.querySelector('.canvas');
        const gridCellWidth = (canvas.clientWidth - sidebarWidth) / gridSize;
        const gridCellHeight = canvas.clientHeight / gridSize;
        const snappedX = Math.floor(x / gridCellWidth);
        const snappedY = Math.floor(y / gridCellHeight);
        return { snappedX, snappedY };
    };

    //calculate current snapped cells
    const calculateCells = (snappedX, snappedY) => {
        const cells = [];
        for (let row = 0; row < itemSizeY; row++) {
            for (let col = 0; col < itemSizeX; col++) {
                const cellIndex = (snappedY + row) * gridSize + (snappedX + col);
                cells.push(cellIndex);
            }
        }
        return cells;
    };

    //update element with new values
    const updateElement = (id, newValues) => {
        setItems(items => items.map(
            item => item.id === id ? { ...item, ...newValues } : item
        ));
    };

    //delete element from the canvas
    const handleDelete = (item) => {
        setHighlightedCells([]);
        setItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);

            if (existingItem) {
                const updatedItems = prevItems.filter(i => i.id !== item.id);
                addLog(`${item.elementType} with id ${item.id} deleted.`);
                return updatedItems;
            }

            return prevItems;
        });
    };

    return (
        <div
            ref={drop}
            className="canvas"
            style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
        >
            {Array.from({ length: gridSize * gridSize }, (_, index) => {
                let cellClass = 'grid-cell';

                if (highlightedCells.includes(index)) {
                    cellClass += overlapDetectedRef.current ? ' overlap' : ' highlight';
                }

                return <div key={index} className={cellClass} />;
            })}

            {items.map((item) => (
                <CanvasElement
                    key={item.id + item.request}
                    item={item}
                    attached={item.attached}
                    itemSizeX={itemSizeX}
                    itemSizeY={itemSizeY}
                    updateElement={updateElement}
                    isRunning={isRunning}
                    handleDelete={handleDelete}
                />
            ))}
        </div>
    );
};

export default Canvas;
