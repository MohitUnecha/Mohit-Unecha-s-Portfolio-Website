"use client";

import React from "react";

// Pong Game
export function PongGame({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [score, setScore] = React.useState({ player: 0, computer: 0 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    let ballX = 300, ballY = 200, ballDX = 4, ballDY = 4;
    let playerY = 150, computerY = 150;
    const paddleHeight = 100, paddleWidth = 10;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      playerY = e.clientY - rect.top - paddleHeight / 2;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const gameLoop = setInterval(() => {
      // Move ball
      ballX += ballDX;
      ballY += ballDY;

      // Ball collision with top/bottom
      if (ballY <= 0 || ballY >= canvas.height) ballDY *= -1;

      // Ball collision with paddles
      if (ballX <= 20 && ballY >= playerY && ballY <= playerY + paddleHeight) ballDX *= -1;
      if (ballX >= canvas.width - 20 && ballY >= computerY && ballY <= computerY + paddleHeight) ballDX *= -1;

      // Score
      if (ballX <= 0) {
        setScore(s => ({ ...s, computer: s.computer + 1 }));
        ballX = 300;
        ballY = 200;
      }
      if (ballX >= canvas.width) {
        setScore(s => ({ ...s, player: s.player + 1 }));
        ballX = 300;
        ballY = 200;
      }

      // Computer AI
      if (computerY + paddleHeight / 2 < ballY) computerY += 3;
      if (computerY + paddleHeight / 2 > ballY) computerY -= 3;

      // Draw
      ctx.fillStyle = isDarkMode ? "#0f172a" : "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = isDarkMode ? "#10b981" : "#3b82f6";
      ctx.fillRect(10, playerY, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - 20, computerY, paddleWidth, paddleHeight);

      ctx.fillStyle = isDarkMode ? "#f87171" : "#ef4444";
      ctx.beginPath();
      ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
      ctx.fill();
    }, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDarkMode]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Pong</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
        You: {score.player} | Computer: {score.computer}
      </div>
      <canvas ref={canvasRef} className="rounded-lg border-2" style={{ borderColor: isDarkMode ? "#10b981" : "#3b82f6" }} />
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Move your mouse to control the paddle</p>
    </div>
  );
}

// Flappy Bird Game
export function FlappyGame({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [score, setScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 600;

    let birdY = 250, velocity = 0;
    let pipes: { x: number; gap: number; height: number }[] = [];
    let frameCount = 0;
    let gameRunning = true;

    const handleClick = () => {
      if (gameOver) {
        setGameOver(false);
        setScore(0);
        birdY = 250;
        velocity = 0;
        pipes = [];
        frameCount = 0;
        gameRunning = true;
      } else {
        velocity = -8;
      }
    };

    canvas.addEventListener("click", handleClick);

    const gameLoop = setInterval(() => {
      if (!gameRunning) return;

      frameCount++;
      velocity += 0.5;
      birdY += velocity;

      if (frameCount % 90 === 0) {
        pipes.push({ x: canvas.width, gap: Math.random() * 200 + 150, height: Math.random() * 200 + 50 });
      }

      pipes = pipes.filter(p => {
        p.x -= 3;
        if (p.x + 50 < 0) {
          setScore(s => s + 1);
          return false;
        }
        return true;
      });

      // Collision
      if (birdY < 0 || birdY > canvas.height) {
        gameRunning = false;
        setGameOver(true);
      }

      pipes.forEach(p => {
        if (50 > p.x && 50 < p.x + 50 && (birdY < p.height || birdY > p.height + p.gap)) {
          gameRunning = false;
          setGameOver(true);
        }
      });

      // Draw
      ctx.fillStyle = isDarkMode ? "#0f172a" : "#e0f2fe";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = isDarkMode ? "#fbbf24" : "#f59e0b";
      ctx.fillRect(20, birdY - 15, 30, 30);

      ctx.fillStyle = isDarkMode ? "#10b981" : "#22c55e";
      pipes.forEach(p => {
        ctx.fillRect(p.x, 0, 50, p.height);
        ctx.fillRect(p.x, p.height + p.gap, 50, canvas.height);
      });
    }, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      canvas.removeEventListener("click", handleClick);
    };
  }, [isDarkMode, gameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Flappy Bird</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Score: {score}</div>
      <canvas ref={canvasRef} className="rounded-lg border-2" style={{ borderColor: isDarkMode ? "#10b981" : "#3b82f6" }} />
      {gameOver && <p className={`font-semibold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>Game Over! Click to restart</p>}
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Click to flap</p>
    </div>
  );
}

// 2048 Game
export function Game2048({ isDarkMode }: { isDarkMode: boolean }) {
  const [grid, setGrid] = React.useState<number[][]>([]);
  const [score, setScore] = React.useState(0);

  const initGrid = () => {
    const newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
    addNumber(newGrid);
    addNumber(newGrid);
    setGrid(newGrid);
    setScore(0);
  };

  React.useEffect(() => {
    initGrid();
  }, []);

  const addNumber = (g: number[][]) => {
    const empty: [number, number][] = [];
    g.forEach((row, i) => row.forEach((cell, j) => { if (cell === 0) empty.push([i, j]); }));
    if (empty.length > 0) {
      const [i, j] = empty[Math.floor(Math.random() * empty.length)];
      g[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = (direction: string) => {
    const newGrid = grid.map(row => [...row]);
    let moved = false;

    const compress = (row: number[]) => row.filter(x => x !== 0).concat(Array(4).fill(0)).slice(0, 4);
    const merge = (row: number[]) => {
      for (let i = 0; i < 3; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
          row[i] *= 2;
          setScore(s => s + row[i]);
          row[i + 1] = 0;
          moved = true;
        }
      }
      return compress(row);
    };

    if (direction === "left") {
      for (let i = 0; i < 4; i++) {
        const old = [...newGrid[i]];
        newGrid[i] = merge(compress(newGrid[i]));
        if (JSON.stringify(old) !== JSON.stringify(newGrid[i])) moved = true;
      }
    }
    // Add other directions similarly...

    if (moved) {
      addNumber(newGrid);
      setGrid(newGrid);
    }
  };

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowLeft") move("left");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>2048</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Score: {score}</div>
      <div className="grid grid-cols-4 gap-2 p-4 rounded-lg" style={{ background: isDarkMode ? "#1e293b" : "#e2e8f0" }}>
        {grid.map((row, i) => row.map((cell, j) => (
          <div key={`${i}-${j}`} className={`w-16 h-16 flex items-center justify-center rounded font-bold text-xl`}
            style={{ background: cell === 0 ? (isDarkMode ? "#334155" : "#cbd5e1") : (isDarkMode ? "#10b981" : "#3b82f6"), color: "#fff" }}>
            {cell || ""}
          </div>
        )))}
      </div>
      <button onClick={initGrid} className={`px-4 py-2 rounded ${isDarkMode ? "bg-emerald-500" : "bg-blue-500"} text-white font-semibold`}>
        New Game
      </button>
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Use arrow keys (left working)</p>
    </div>
  );
}

// Tetris Game (simplified)
export function TetrisGame({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Tetris</h2>
      <div className={`text-center p-8 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
        Coming soon! 🎮
      </div>
    </div>
  );
}

// Breakout Game
export function BreakoutGame({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Breakout</h2>
      <div className={`text-center p-8 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
        Coming soon! 🎮
      </div>
    </div>
  );
}
