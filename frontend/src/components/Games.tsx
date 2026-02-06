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

// Memory Match Game
export function MemoryMatchGame({ isDarkMode }: { isDarkMode: boolean }) {
  const [cards, setCards] = React.useState<number[]>([]);
  const [flipped, setFlipped] = React.useState<number[]>([]);
  const [matched, setMatched] = React.useState<number[]>([]);
  const [moves, setMoves] = React.useState(0);

  React.useEffect(() => {
    const numbers = Array.from({ length: 8 }, (_, i) => i);
    setCards([...numbers, ...numbers].sort(() => Math.random() - 0.5));
  }, []);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const resetGame = () => {
    const numbers = Array.from({ length: 8 }, (_, i) => i);
    setCards([...numbers, ...numbers].sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Memory Match</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Moves: {moves}</div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => handleCardClick(i)}
            className={`w-16 h-16 rounded-lg font-bold text-2xl transition-all ${
              flipped.includes(i) || matched.includes(i)
                ? isDarkMode ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
                : isDarkMode ? "bg-slate-700" : "bg-slate-300"
            }`}
          >
            {(flipped.includes(i) || matched.includes(i)) ? card : "?"}
          </button>
        ))}
      </div>
      {matched.length === 16 && (
        <p className={`font-bold text-xl ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>You Won in {moves} moves!</p>
      )}
      <button onClick={resetGame} className={`px-4 py-2 rounded ${isDarkMode ? "bg-emerald-500" : "bg-blue-500"} text-white font-semibold`}>
        New Game
      </button>
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Tap cards to find matching pairs</p>
    </div>
  );
}

// Space Invaders Game
export function SpaceInvadersGame({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [score, setScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 500;

    let playerX = 180;
    let bullets: { x: number; y: number }[] = [];
    let aliens: { x: number; y: number; alive: boolean }[] = [];
    let alienSpeed = 1;
    let alienDirection = 1;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        aliens.push({ x: col * 45 + 20, y: row * 40 + 30, alive: true });
      }
    }

    const shoot = () => {
      bullets.push({ x: playerX + 18, y: 450 });
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") playerX = Math.max(0, playerX - 20);
      if (e.key === "ArrowRight") playerX = Math.min(360, playerX + 20);
      if (e.key === " ") shoot();
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      if (touchX < canvas.width / 3) playerX = Math.max(0, playerX - 20);
      else if (touchX > (canvas.width * 2) / 3) playerX = Math.min(360, playerX + 20);
      else shoot();
    };

    const gameLoop = () => {
      if (gameOver) return;

      ctx.fillStyle = isDarkMode ? "#0f172a" : "#f1f5f9";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = isDarkMode ? "#10b981" : "#3b82f6";
      ctx.fillRect(playerX, 460, 40, 20);

      bullets.forEach((b, i) => {
        b.y -= 5;
        if (b.y < 0) bullets.splice(i, 1);
        ctx.fillStyle = isDarkMode ? "#10b981" : "#3b82f6";
        ctx.fillRect(b.x, b.y, 4, 10);
      });

      aliens.forEach((alien) => {
        if (!alien.alive) return;
        alien.x += alienSpeed * alienDirection;
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(alien.x, alien.y, 30, 20);

        bullets.forEach((b, i) => {
          if (b.x > alien.x && b.x < alien.x + 30 && b.y > alien.y && b.y < alien.y + 20) {
            alien.alive = false;
            bullets.splice(i, 1);
            setScore(s => s + 10);
          }
        });

        if (alien.y > 440) setGameOver(true);
      });

      const rightMost = Math.max(...aliens.filter(a => a.alive).map(a => a.x));
      const leftMost = Math.min(...aliens.filter(a => a.alive).map(a => a.x));
      
      if (rightMost > 370 || leftMost < 0) {
        alienDirection *= -1;
        aliens.forEach(a => { if (a.alive) a.y += 20; });
      }

      if (aliens.every(a => !a.alive)) setGameOver(true);

      requestAnimationFrame(gameLoop);
    };

    window.addEventListener("keydown", handleKey);
    canvas.addEventListener("touchstart", handleTouch);
    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKey);
      canvas.removeEventListener("touchstart", handleTouch);
    };
  }, [isDarkMode, gameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Space Invaders</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Score: {score}</div>
      <canvas ref={canvasRef} className="rounded-lg border-2" style={{ borderColor: isDarkMode ? "#10b981" : "#3b82f6" }} />
      {gameOver && <p className={`font-semibold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Game Over!</p>}
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Arrow keys or tap left/right/middle to play</p>
    </div>
  );
}

// Simon Says Game
export function SimonSaysGame({ isDarkMode }: { isDarkMode: boolean }) {
  const [sequence, setSequence] = React.useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = React.useState<number[]>([]);
  const [active, setActive] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [gameStarted, setGameStarted] = React.useState(false);

  const colors = ["#ef4444", "#10b981", "#3b82f6", "#f59e0b"];
  const colorNames = ["Red", "Green", "Blue", "Yellow"];

  const playSequence = (seq: number[]) => {
    seq.forEach((color, i) => {
      setTimeout(() => {
        setActive(color);
        setTimeout(() => setActive(null), 400);
      }, i * 600);
    });
  };

  const startGame = () => {
    const newSeq = [Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setPlayerSeq([]);
    setScore(0);
    setGameStarted(true);
    setTimeout(() => playSequence(newSeq), 500);
  };

  const handleColor = (color: number) => {
    if (!gameStarted || active !== null) return;

    const newPlayerSeq = [...playerSeq, color];
    setPlayerSeq(newPlayerSeq);

    if (sequence[newPlayerSeq.length - 1] !== color) {
      setGameStarted(false);
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      setScore(sequence.length);
      const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(nextSeq);
      setPlayerSeq([]);
      setTimeout(() => playSequence(nextSeq), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Simon Says</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Score: {score}</div>
      <div className="grid grid-cols-2 gap-3">
        {colors.map((color, i) => (
          <button
            key={i}
            onClick={() => handleColor(i)}
            className="w-24 h-24 rounded-lg transition-all"
            style={{
              backgroundColor: active === i ? color : `${color}80`,
              boxShadow: active === i ? `0 0 20px ${color}` : "none",
            }}
          />
        ))}
      </div>
      {!gameStarted && (
        <button onClick={startGame} className={`px-4 py-2 rounded ${isDarkMode ? "bg-emerald-500" : "bg-blue-500"} text-white font-semibold`}>
          {score > 0 ? "Play Again" : "Start Game"}
        </button>
      )}
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
        {gameStarted ? "Repeat the sequence!" : "Tap to start"}
      </p>
    </div>
  );
}

// Tic Tac Toe Game
export function TicTacToeGame({ isDarkMode }: { isDarkMode: boolean }) {
  const [board, setBoard] = React.useState<string[]>(Array(9).fill(""));
  const [isX, setIsX] = React.useState(true);
  const [winner, setWinner] = React.useState<string | null>(null);

  const checkWinner = (squares: string[]) => {
    const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(s => s) ? "Draw" : null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = isX ? "X" : "O";
    setBoard(newBoard);
    setIsX(!isX);
    setWinner(checkWinner(newBoard));
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setIsX(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Tic Tac Toe</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
        {winner ? (winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`) : `Player ${isX ? "X" : "O"}'s Turn`}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-20 h-20 rounded-lg font-bold text-4xl ${
              isDarkMode ? "bg-slate-700 text-emerald-400" : "bg-slate-200 text-blue-600"
            }`}
          >
            {cell}
          </button>
        ))}
      </div>
      <button onClick={resetGame} className={`px-4 py-2 rounded ${isDarkMode ? "bg-emerald-500" : "bg-blue-500"} text-white font-semibold`}>
        New Game
      </button>
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Get 3 in a row to win</p>
    </div>
  );
}

// Race Game
export function RaceGame({ isDarkMode }: { isDarkMode: boolean }) {
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

    let carX = 175;
    let carY = 500;
    let obstacles: { x: number; y: number; lane: number }[] = [];
    let speed = 3;
    let roadOffset = 0;

    const lanes = [50, 150, 250, 350];

    const addObstacle = () => {
      const lane = Math.floor(Math.random() * 4);
      obstacles.push({ x: lanes[lane], y: -50, lane });
    };

    let obstacleTimer = 0;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && carX > 50) carX -= 100;
      if (e.key === "ArrowRight" && carX < 350) carX += 100;
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      if (touchX < canvas.width / 2 && carX > 50) carX -= 100;
      if (touchX > canvas.width / 2 && carX < 350) carX += 100;
    };

    const gameLoop = () => {
      if (gameOver) return;

      roadOffset = (roadOffset + speed) % 40;

      ctx.fillStyle = isDarkMode ? "#1e293b" : "#94a3b8";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road lanes
      ctx.strokeStyle = isDarkMode ? "#475569" : "#cbd5e1";
      ctx.lineWidth = 4;
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, i + roadOffset);
        ctx.lineTo(canvas.width / 2, i + roadOffset + 20);
        ctx.stroke();
      }

      // Draw car
      ctx.fillStyle = isDarkMode ? "#10b981" : "#3b82f6";
      ctx.fillRect(carX - 20, carY, 40, 60);

      // Draw obstacles
      obstacles.forEach((obs, i) => {
        obs.y += speed;
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(obs.x - 20, obs.y, 40, 60);

        // Collision detection
        if (
          obs.y + 60 > carY &&
          obs.y < carY + 60 &&
          Math.abs(obs.x - carX) < 40
        ) {
          setGameOver(true);
        }

        // Remove passed obstacles and increase score
        if (obs.y > canvas.height) {
          obstacles.splice(i, 1);
          setScore(s => s + 1);
          if (score % 10 === 0) speed += 0.5;
        }
      });

      // Add new obstacles
      obstacleTimer++;
      if (obstacleTimer > 60 / speed) {
        addObstacle();
        obstacleTimer = 0;
      }

      requestAnimationFrame(gameLoop);
    };

    window.addEventListener("keydown", handleKey);
    canvas.addEventListener("touchstart", handleTouch);
    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKey);
      canvas.removeEventListener("touchstart", handleTouch);
    };
  }, [isDarkMode, gameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Race Game</h2>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Score: {score}</div>
      <canvas ref={canvasRef} className="rounded-lg border-2" style={{ borderColor: isDarkMode ? "#10b981" : "#3b82f6" }} />
      {gameOver && <p className={`font-semibold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>Crashed! Final Score: {score}</p>}
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Arrow keys or tap left/right to dodge</p>
    </div>
  );
}

// Whack-a-Mole Game
export function WhackAMoleGame({ isDarkMode }: { isDarkMode: boolean }) {
  const [moles, setMoles] = React.useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(30);
  const [gameStarted, setGameStarted] = React.useState(false);

  React.useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    const moleTimer = setInterval(() => {
      const newMoles = Array(9).fill(false);
      const randomIndex = Math.floor(Math.random() * 9);
      newMoles[randomIndex] = true;
      setMoles(newMoles);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(moleTimer);
    };
  }, [gameStarted, timeLeft]);

  const whackMole = (index: number) => {
    if (!gameStarted || timeLeft <= 0) return;
    if (moles[index]) {
      setScore(s => s + 1);
      setMoles(m => m.map((_, i) => i === index ? false : _));
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameStarted(true);
    setMoles(Array(9).fill(false));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-blue-600"}`}>Whack-a-Mole</h2>
      <div className={`flex gap-8 text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {moles.map((active, i) => (
          <button
            key={i}
            onClick={() => whackMole(i)}
            className={`w-20 h-20 rounded-full text-4xl transition-all ${
              active
                ? isDarkMode ? "bg-emerald-500 scale-110" : "bg-blue-500 scale-110"
                : isDarkMode ? "bg-slate-700" : "bg-slate-300"
            }`}
          >
            {active ? "🦫" : "🕳️"}
          </button>
        ))}
      </div>
      {(!gameStarted || timeLeft <= 0) && (
        <button onClick={startGame} className={`px-4 py-2 rounded ${isDarkMode ? "bg-emerald-500" : "bg-blue-500"} text-white font-semibold`}>
          {timeLeft <= 0 && score > 0 ? `Play Again (${score} points!)` : "Start Game"}
        </button>
      )}
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
        {gameStarted && timeLeft > 0 ? "Tap the moles!" : "Hit as many moles as you can in 30 seconds"}
      </p>
    </div>
  );
}
