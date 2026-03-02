import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const GRID_SIZE = 20;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

export default function CollisionRadar() {
  const [player, setPlayer] = useState<Rect>({ x: 100, y: 300, width: 50, height: 50 });
  const [star, setStar] = useState<Rect>({ x: 350, y: 50, width: 50, height: 50 });
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // AABB Collision Detection
  const checkCollision = (rect1: Rect, rect2: Rect): boolean => {
    return !(
      rect1.x + rect1.width < rect2.x ||
      rect1.x > rect2.x + rect2.width ||
      rect1.y + rect1.height < rect2.y ||
      rect1.y > rect2.y + rect2.height
    );
  };

  const isColliding = checkCollision(player, star);

  // Mission: "Position the player so it is JUST barely touching the star's left edge"
  // This means player.right is >= star.left, but not overlapping too much (e.g., player.right <= star.left + 10)
  // And their Y values must overlap so they are actually touching
  const playerRight = player.x + player.width;
  const isMissionSuccess =
    playerRight >= star.x &&
    playerRight <= star.x + 10 &&
    player.x < star.x && // Player is on the left
    player.y + player.height >= star.y &&
    player.y <= star.y + star.height;

  const handleMouseDown = (e: React.MouseEvent, rect: "player" | "star") => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current.getBoundingClientRect();
    const target = rect === "player" ? player : star;
    setDragging(rect);
    setDragOffset({
      x: e.clientX - canvas.left - target.x,
      y: e.clientY - canvas.top - target.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current) return;
    const canvas = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(CANVAS_WIDTH - 50, e.clientX - canvas.left - dragOffset.x));
    const newY = Math.max(0, Math.min(CANVAS_HEIGHT - 50, e.clientY - canvas.top - dragOffset.y));

    if (dragging === "player") {
      setPlayer({ ...player, x: newX, y: newY });
    } else {
      setStar({ ...star, x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div className="space-y-6">
      {/* Explanation */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">How Collision Detection Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-200">
          <p>
            When you catch a star in the game, the computer checks: <strong>"Are the player and star rectangles overlapping?"</strong>
          </p>
          <p>
            This is called <strong>AABB collision detection</strong> (Axis-Aligned Bounding Box). It compares four numbers:
          </p>
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 font-mono text-sm space-y-2">
            <div>NOT (player.right &lt; star.left OR</div>
            <div className="ml-4">player.left &gt; star.right OR</div>
            <div className="ml-4">player.bottom &lt; star.top OR</div>
            <div className="ml-4">player.top &gt; star.bottom)</div>
          </div>
          <p className="text-slate-400 text-sm">
            In Python, Pygame Zero does this with one line: <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300">player.colliderect(star)</code>
          </p>
        </CardContent>
      </Card>

      {/* Interactive Sandbox */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">Try It: Drag the Rectangles</CardTitle>
          <CardDescription className="text-slate-300">Move the cyan player or gold star to see collision detection in action</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden w-full max-w-[500px]"
            style={{ height: CANVAS_HEIGHT }}
          >
            {/* Grid Background */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
              <defs>
                <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                  <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Player Rectangle */}
            <motion.div
              onMouseDown={(e) => handleMouseDown(e as any, "player")}
              className="absolute bg-cyan-400 cursor-move select-none flex items-center justify-center text-slate-900 text-xs font-bold"
              style={{
                left: player.x,
                top: player.y,
                width: player.width,
                height: player.height,
                borderRadius: "4px",
              }}
              animate={{
                boxShadow: isColliding ? "0 0 20px rgba(0, 217, 255, 0.8)" : "0 0 10px rgba(0, 217, 255, 0.4)",
              }}
              transition={{ duration: 0.2 }}
            >
              Player
            </motion.div>

            {/* Star Rectangle */}
            <motion.div
              onMouseDown={(e) => handleMouseDown(e as any, "star")}
              className="absolute bg-yellow-400 cursor-move select-none flex items-center justify-center text-slate-900 text-xs font-bold"
              style={{
                left: star.x,
                top: star.y,
                width: star.width,
                height: star.height,
                borderRadius: "4px",
              }}
              animate={{
                boxShadow: isColliding ? "0 0 20px rgba(255, 215, 0, 0.8)" : "0 0 10px rgba(255, 215, 0, 0.4)",
              }}
              transition={{ duration: 0.2 }}
            >
              Star
            </motion.div>

            {/* Collision Indicator */}
            <motion.div
              className="absolute top-4 right-4 px-3 py-2 rounded-lg font-semibold text-sm"
              animate={{
                backgroundColor: isColliding ? "rgba(74, 222, 128, 0.2)" : "rgba(239, 68, 68, 0.2)",
                borderColor: isColliding ? "rgb(74, 222, 128)" : "rgb(239, 68, 68)",
                color: isColliding ? "rgb(134, 239, 172)" : "rgb(252, 165, 165)",
              }}
              transition={{ duration: 0.2 }}
              style={{
                border: "2px solid",
              }}
            >
              {isColliding ? "✓ COLLIDING" : "✗ SAFE"}
            </motion.div>
          </div>

          {/* Coordinate Display */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <h4 className="text-cyan-400 font-semibold mb-2">Player</h4>
              <div className="text-sm text-slate-300 space-y-1 font-mono">
                <div>x: {Math.round(player.x)}</div>
                <div>y: {Math.round(player.y)}</div>
                <div>right: {Math.round(player.x + player.width)}</div>
                <div>bottom: {Math.round(player.y + player.height)}</div>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">Star</h4>
              <div className="text-sm text-slate-300 space-y-1 font-mono">
                <div>x: {Math.round(star.x)}</div>
                <div>y: {Math.round(star.y)}</div>
                <div>right: {Math.round(star.x + star.width)}</div>
                <div>bottom: {Math.round(star.y + star.height)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <Card className="border-green-700/50 bg-green-900/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <p className="text-green-300 font-semibold mb-2">💡 Key Insight:</p>
          <p className="text-slate-200 text-sm">
            <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300">colliderect()</code> is just checking if the edges of two rectangles overlap. It is pure math—no magic! When you catch the star, the game adds 1 to your score.
          </p>
        </CardContent>
      </Card>
      {/* 🎯 Mission */}
      <Card className={`backdrop-blur-sm mt-6 border-2 transition-colors ${isMissionSuccess ? 'border-green-500 bg-green-900/40' : 'border-purple-700/50 bg-purple-900/20'}`}>
        <CardContent className="pt-6">
          <p className={`font-bold mb-2 flex items-center gap-2 ${isMissionSuccess ? 'text-green-400' : 'text-purple-300'}`}>
            🎯 Mission: The Edge Case {isMissionSuccess && "— SUCCESS! 🎉"}
          </p>
          <p className="text-slate-200 text-sm">
            Position the player so it is <strong>just barely touching</strong> the star's left edge. This is testing the exact moment <code className="bg-slate-900 px-1 rounded">player.right &gt; star.left</code> becomes true.
          </p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">Status:</span>
            <span className={isMissionSuccess ? 'text-green-400 font-bold' : 'text-slate-400'}>
              {isMissionSuccess ? "Mission Complete!" : "Keep trying..."}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
