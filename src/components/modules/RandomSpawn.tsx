import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 200;
const STAR_SIZE = 40;

export default function RandomSpawn() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number }[]>([]);
  const [spawnCount, setSpawnCount] = useState(0);

  const spawnStar = () => {
    // Math.random() gives 0.0 to 0.999...
    // Multiply by max X to get a random position
    const randomX = Math.floor(Math.random() * (CANVAS_WIDTH - STAR_SIZE));
    
    const newStar = {
      id: Date.now(),
      x: randomX,
      y: 0,
    };

    setStars((prev) => [...prev.slice(-9), newStar]); // Keep last 10
    setSpawnCount((prev) => prev + 1);
  };

  const clearStars = () => {
    setStars([]);
    setSpawnCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Explanation */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">Random Numbers in Games</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-200">
          <p>
            If the star always fell from the exact same spot, the game would be boring. We need it to appear at a random horizontal position across the screen.
          </p>
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 font-mono text-sm space-y-2">
            <div className="text-cyan-300">import random</div>
            <div className="mt-2 text-slate-400"># Pick a number between 0 and 460</div>
            <div className="text-cyan-300">star.x = random.randint(0, 460)</div>
          </div>
          <p className="text-slate-400 text-sm">
            Why 460? Because the screen is 500 pixels wide, and the star is 40 pixels wide. If it spawned at 500, it would be off the edge!
          </p>
        </CardContent>
      </Card>

      {/* Interactive Sandbox */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">Try It: The Spawn Zone</CardTitle>
          <CardDescription className="text-slate-300">Click to spawn stars at random X coordinates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex gap-4 items-center">
            <Button 
              onClick={spawnStar}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold px-8"
            >
              ⭐ Spawn Star
            </Button>
            <Button 
              onClick={clearStars}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Clear
            </Button>
            <span className="text-sm text-slate-400 ml-auto">
              Total Spawns: {spawnCount}
            </span>
          </div>

          {/* Canvas */}
          <div 
            className="relative bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden w-full max-w-[500px]"
            style={{ height: CANVAS_HEIGHT }}
          >
            {/* Grid Background */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <defs>
                <pattern id="randomGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#randomGrid)" />
              {/* x-axis ruler */}
              <text x="5" y="190" fill="#64748b" fontSize="10">0</text>
              <text x="240" y="190" fill="#64748b" fontSize="10">250</text>
              <text x="475" y="190" fill="#64748b" fontSize="10">500</text>
            </svg>

            {/* Stars */}
            {stars.map((star, index) => {
              const isLatest = index === stars.length - 1;
              return (
                <motion.div
                  key={star.id}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: star.y, opacity: isLatest ? 1 : 0.4 }}
                  className="absolute flex flex-col items-center"
                  style={{ left: star.x }}
                >
                  <div className={`w-[40px] h-[40px] rounded flex items-center justify-center text-xl shadow-[0_0_15px_rgba(255,215,0,0.5)] ${isLatest ? 'bg-yellow-400' : 'bg-yellow-400/50'}`}>
                    ⭐
                  </div>
                  {isLatest && (
                    <div className="absolute top-[45px] bg-slate-800 text-yellow-400 text-xs px-2 py-1 rounded border border-slate-600 whitespace-nowrap z-10">
                      x: {Math.round(star.x)}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

        </CardContent>
      </Card>

      {/* Key Insight */}
      <Card className="border-green-700/50 bg-green-900/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <p className="text-green-300 font-semibold mb-2">💡 Key Insight:</p>
          <p className="text-slate-200 text-sm">
            Is there a pattern? No! That is the point. <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300">random.randint()</code> ensures the game is unpredictable every time you play. Notice how the star never spawns completely off the right edge because we capped the maximum value.
          </p>
        </CardContent>
      </Card>
      
      {/* 🎯 Mission */}
      <Card className="border-purple-700/50 bg-purple-900/20 backdrop-blur-sm mt-6">
        <CardContent className="pt-6">
          <p className="text-purple-300 font-bold mb-2 flex items-center gap-2">
            🎯 Mission: The "Clump" Test
          </p>
          <p className="text-slate-200 text-sm">
            Spam the "Spawn Star" button 20 times. Do the stars distribute evenly across the 500 pixels, or do they "clump" together in groups? True randomness is often clumpy! 
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
