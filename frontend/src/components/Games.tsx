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

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      playerY = e.touches[0].clientY - rect.top - paddleHeight / 2;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);

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
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDarkMode]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Pong</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
        You: {score.player} | Computer: {score.computer}
      </div>
      <canvas ref={canvasRef} className="rounded-lg border-2" style={{ borderColor: isDarkMode ? "#10b981" : "#3b82f6" }} />
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Move mouse or touch to control</p>
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

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      handleClick();
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleTouch);

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
      canvas.removeEventListener("touchstart", handleTouch);
    };
  }, [isDarkMode, gameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Flappy Bird</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Score: {score}</div>
      <canvas ref={canvasRef} className="rounded-lg border-2" style={{ borderColor: isDarkMode ? "#10b981" : "#3b82f6" }} />
      {gameOver && <p className={`font-semibold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>Game Over! Click to restart</p>}
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Click or tap to flap</p>
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
    } else if (direction === "right") {
      for (let i = 0; i < 4; i++) {
        const old = [...newGrid[i]];
        newGrid[i] = merge(compress(newGrid[i].reverse())).reverse();
        if (JSON.stringify(old) !== JSON.stringify(newGrid[i])) moved = true;
      }
    } else if (direction === "up") {
      for (let c = 0; c < 4; c++) {
        let col = newGrid.map(row => row[c]);
        const old = [...col];
        col = merge(compress(col));
        if (JSON.stringify(old) !== JSON.stringify(col)) moved = true;
        col.forEach((val, r) => newGrid[r][c] = val);
      }
    } else if (direction === "down") {
      for (let c = 0; c < 4; c++) {
        let col = newGrid.map(row => row[c]);
        const old = [...col];
        col = merge(compress(col.reverse())).reverse();
        if (JSON.stringify(old) !== JSON.stringify(col)) moved = true;
        col.forEach((val, r) => newGrid[r][c] = val);
      }
    }

    if (moved) {
      addNumber(newGrid);
      setGrid(newGrid);
    }
  };

  React.useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowLeft") move("left");
        if (e.key === "ArrowRight") move("right");
        if (e.key === "ArrowUp") move("up");
        if (e.key === "ArrowDown") move("down");
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) move("right");
        else if (dx < -30) move("left");
      } else {
        if (dy > 30) move("down");
        else if (dy < -30) move("up");
      }
    };

    window.addEventListener("keydown", handleKey);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
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
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Use arrow keys or swipe to play</p>
    </div>
  );
}

// Tetris Game (fully implemented)
export function TetrisGame({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [score, setScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 600;

    const COLS = 10;
    const ROWS = 20;
    const BLOCK = 30;

    let grid = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
    let currentPiece = { x: 3, y: 0, shape: [[1,1,1,1]] };
    let gameRunning = true;

    const pieces = [
      [[1,1,1,1]], // I
      [[1,1],[1,1]], // O
      [[0,1,0],[1,1,1]], // T
      [[1,0,0],[1,1,1]], // L
      [[0,0,1],[1,1,1]], // J
      [[0,1,1],[1,1,0]], // S
      [[1,1,0],[0,1,1]], // Z
    ];

    const newPiece = () => {
      currentPiece = {
        x: 3,
        y: 0,
        shape: pieces[Math.floor(Math.random() * pieces.length)]
      };
    };

    const collision = (x: number, y: number, shape: number[][]) => {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const newX = x + c;
            const newY = y + r;
            if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
            if (newY >= 0 && grid[newY][newX]) return true;
          }
        }
      }
      return false;
    };

    const merge = () => {
      currentPiece.shape.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val) {
            const y = currentPiece.y + r;
            const x = currentPiece.x + c;
            if (y >= 0) grid[y][x] = 1;
          }
        });
      });

      // Clear lines
      grid = grid.filter(row => row.some(cell => cell === 0));
      const cleared = ROWS - grid.length;
      setScore(s => s + cleared * 100);
      while (grid.length < ROWS) grid.unshift(Array(COLS).fill(0));

      newPiece();
      if (collision(currentPiece.x, currentPiece.y, currentPiece.shape)) {
        gameRunning = false;
        setGameOver(true);
      }
    };

    const move = (dir: string) => {
      if (!gameRunning) return;
      if (dir === "left" && !collision(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) currentPiece.x--;
      if (dir === "right" && !collision(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) currentPiece.x++;
      if (dir === "down") {
        if (!collision(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
          currentPiece.y++;
        } else {
          merge();
        }
      }
      if (dir === "rotate") {
        const rotated = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i]).reverse());
        if (!collision(currentPiece.x, currentPiece.y, rotated)) currentPiece.shape = rotated;
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move("left");
      if (e.key === "ArrowRight") move("right");
      if (e.key === "ArrowDown") move("down");
      if (e.key === "ArrowUp") move("rotate");
    };

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      if (y > canvas.height * 0.8) {
        if (x < canvas.width / 3) move("left");
        else if (x > canvas.width * 2/3) move("right");
        else move("down");
      } else {
        move("rotate");
      }
    };

    window.addEventListener("keydown", handleKey);
    canvas.addEventListener("touchstart", handleTouch);

    const gameLoop = setInterval(() => {
      if (!gameRunning) return;
      move("down");

      // Draw
      ctx.fillStyle = isDarkMode ? "#0f172a" : "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            ctx.fillStyle = isDarkMode ? "#10b981" : "#3b82f6";
            ctx.fillRect(c * BLOCK, r * BLOCK, BLOCK - 1, BLOCK - 1);
          }
        });
      });

      // Draw current piece
      ctx.fillStyle = isDarkMode ? "#fbbf24" : "#f59e0b";
      currentPiece.shape.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val) {
            ctx.fillRect((currentPiece.x + c) * BLOCK, (currentPiece.y + r) * BLOCK, BLOCK - 1, BLOCK - 1);
          }
        });
      });
    }, 500);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("keydown", handleKey);
      canvas.removeEventListener("touchstart", handleTouch);
    };
  }, [isDarkMode, gameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Tetris</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Score: {score}</div>
      <canvas ref={canvasRef} className="rounded-lg border-2" style={{ borderColor: isDarkMode ? "#10b981" : "#3b82f6" }} />
      {gameOver && <p className={`font-semibold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>Game Over!</p>}
      <p className={`text-sm text-center ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
        Keyboard: Arrow keys | Touch: Tap sides to move, top to rotate
      </p>
    </div>
  );
}

// Breakout Game
export function BreakoutGame({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [score, setScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 480;
    canvas.height = 600;

    let ballX = 240, ballY = 400, ballDX = 4, ballDY = -4;
    let paddleX = 200;
    const paddleW = 80, paddleH = 10;

    const bricks: { x: number; y: number; status: number }[] = [];
    for (let c = 0; c < 8; c++) {
      for (let r = 0; r < 5; r++) {
        bricks.push({ x: c * 60, y: r * 30 + 50, status: 1 });
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      paddleX = e.clientX - rect.left - paddleW / 2;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      paddleX = e.touches[0].clientX - rect.left - paddleW / 2;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);

    const gameLoop = setInterval(() => {
      ballX += ballDX;
      ballY += ballDY;

      if (ballX <= 0 || ballX >= canvas.width) ballDX *= -1;
      if (ballY <= 0) ballDY *= -1;
      if (ballY >= canvas.height) {
        setGameOver(true);
        return;
      }

      if (ballY + 10 >= canvas.height - paddleH && ballX >= paddleX && ballX <= paddleX + paddleW) {
        ballDY *= -1;
      }

      bricks.forEach(brick => {
        if (brick.status === 1 && ballX >= brick.x && ballX <= brick.x + 50 && ballY >= brick.y && ballY <= brick.y + 20) {
          ballDY *= -1;
          brick.status = 0;
          setScore(s => s + 10);
        }
      });

      ctx.fillStyle = isDarkMode ? "#0f172a" : "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = isDarkMode ? "#10b981" : "#3b82f6";
      bricks.forEach(brick => {
        if (brick.status === 1) ctx.fillRect(brick.x, brick.y, 50, 20);
      });

      ctx.fillRect(paddleX, canvas.height - paddleH, paddleW, paddleH);

      ctx.fillStyle = isDarkMode ? "#f87171" : "#ef4444";
      ctx.beginPath();
      ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
      ctx.fill();
    }, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDarkMode, gameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Breakout</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Score: {score}</div>
      <canvas ref={canvasRef} className="rounded-lg border-2" style={{ borderColor: isDarkMode ? "#10b981" : "#3b82f6" }} />
      {gameOver && <p className={`font-semibold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>Game Over!</p>}
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Move mouse or touch to control paddle</p>
    </div>
  );
}
