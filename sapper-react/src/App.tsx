
import React, { useState } from "react";
import './App.css'
interface CellType {
    x: number;
    y: number;
    isOpen: boolean;
    isMine: boolean;
    neighborMineCount: number;
}

interface MinesweeperState {
    width: number;
    height: number;
    mineCount: number;
    cells: CellType[][];
}

const initGame = (width = 12, height = 12, mineCount = 12): MinesweeperState => {
    let cells: CellType[][] = [];
    for (let y = 0; y < height; y++) {
        cells[y] = [];
        for (let x = 0; x < width; x++) {
            let isMine = Math.random() < mineCount /(width * height );
            cells[y][x] = { x, y, isOpen: false, isMine, neighborMineCount: 0 };
        }
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let cell = cells[y][x];
            if (cell.isMine) continue;
            let neighborMineCount = 0;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    let nx = x + dx;
                    let ny = y + dy;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        if (cells[ny][nx].isMine) neighborMineCount += 1;
                    }
                }
            }
            cell.neighborMineCount = neighborMineCount;
        }
    }
    return { width, height, mineCount, cells };
};

const App: React.FC = () => {
    const [gameState, setGameState] = useState<MinesweeperState>(initGame());

    // open cell
    const openCell = (x: number, y: number) => {
        let cells = gameState.cells;
        let cell = cells[y][x];
        if (cell.isOpen) return;
        if (cell.isMine) {
            alert("Game Over!");
            return;
        }
        if (cell.neighborMineCount > 0) {
            cell.isOpen = true;
            setGameState({ ...gameState, cells });
            return;
        }
        let stack: CellType[] = [];
        stack.push(cell);
        while (stack.length > 0) {
            let c = stack.pop()!;
            let cx = c.x;
            let cy = c.y;
            let cc = cells[cy][cx];
            if (cc.isOpen) continue;
            cc.isOpen = true;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    let nx = cx + dx;
                    let ny = cy + dy;
                    if (nx >= 0 && nx < gameState.width && ny >= 0 && ny < gameState.height) {
                        let nc = cells[ny][nx];
                        if (!nc.isMine && !nc.isOpen) stack.push(nc);
                    }
                }
            }
        }
        setGameState({ ...gameState, cells });
    };

    // start game
    const startGame = () => {
        setGameState(initGame());
    };

    // restart game
    const restartGame = () => {
        setGameState({ ...gameState, cells: initGame().cells });
    };

    return (

        <div className={"main-content"}>
            <h1>MineSwapper</h1>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {gameState.cells.map((row, y) => (
                    <div key={y} style={{ padding: 0, margin: 2, alignItems: "center",
                        justifyContent: "center" }}>
                        {row.map((cell, x) => (
                            <div style={{    width: "45px",
                                height: "45px",
                                flex: "wrap",
                                border: "1px solid black",
                                backgroundColor: cell.isOpen ? "#f0f0f0" : "#b0b0b0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                                key={`${x},${y}`}
                                className={"board"}
                                onClick={() => openCell(x, y)}
                            >
                                {cell.isOpen && cell.neighborMineCount > 0
                                    ? cell.neighborMineCount
                                    : cell.isOpen && cell.isMine
                                        ? "💣"
                                        : ""}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button className={"startBtn"} onClick={startGame}>start game</button>
            <button className={"stopBtn"} onClick={restartGame}>restart game</button>
        </div>)}

export default App;
