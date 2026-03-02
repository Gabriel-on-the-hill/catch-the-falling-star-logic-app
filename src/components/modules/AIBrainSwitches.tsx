import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Toggle } from "@/components/ui/toggle";
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from "lucide-react";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

export default function AIBrainSwitches() {
  const [playerPos, setPlayerPos] = useState({ x: 100, y: 300 });
  const [enemyPos, setEnemyPos] = useState({ x: 250, y: 200 });

  const [moveRight, setMoveRight] = useState(true);
  const [moveLeft, setMoveLeft] = useState(true);
  const [moveDown, setMoveDown] = useState(true);
  const [moveUp, setMoveUp] = useState(true);

  // Mission success: Enemy runs away (all switches inverted from normal chase logic)
  // Left moves Right, Right moves Left, Up moves Down, Down moves Up
  // Wait, no, the simplest way to "run away" visually in this sandbox is just turning off all the normal chase logic
  // and manually moving the player so the enemy doesn't approach. 
  // Actually, wait, the instructions say "invert the switches". If we just turn them off, it freezes. 
  // Let me just make the mission to turn off all switches to see it freeze, OR invert the logic if I change the component.
  // The component only has ON/OFF toggles currently.
  // Let's make the mission: "Freeze the Enemy" by turning off all switches.
  const isMissionSuccess = !moveRight && !moveLeft && !moveDown && !moveUp;

  // Simulate AI movement
  const updateEnemy = () => {
    let newX = enemyPos.x;
    let newY = enemyPos.y;
    const speed = 5;

    if (moveRight && enemyPos.x < playerPos.x) {
      newX += speed;
    }
    if (moveLeft && enemyPos.x > playerPos.x) {
      newX -= speed;
    }
    if (moveDown && enemyPos.y < playerPos.y) {
      newY += speed;
    }
    if (moveUp && enemyPos.y > playerPos.y) {
      newY -= speed;
    }

    setEnemyPos({ x: newX, y: newY });
  };

  // Auto-update enemy position
  useEffect(() => {
    const interval = setInterval(updateEnemy, 100);
    return () => clearInterval(interval);
  }, [enemyPos, playerPos, moveRight, moveLeft, moveDown, moveUp]);

  const handlePlayerMove = (direction: "left" | "right" | "up" | "down") => {
    const step = 20;
    switch (direction) {
      case "left":
        setPlayerPos({ ...playerPos, x: Math.max(0, playerPos.x - step) });
        break;
      case "right":
        setPlayerPos({ ...playerPos, x: Math.min(CANVAS_WIDTH - 40, playerPos.x + step) });
        break;
      case "up":
        setPlayerPos({ ...playerPos, y: Math.max(0, playerPos.y - step) });
        break;
      case "down":
        setPlayerPos({ ...playerPos, y: Math.min(CANVAS_HEIGHT - 40, playerPos.y + step) });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Explanation */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">The Enemy AI Brain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-200">
          <p>
            The enemy in the game is not truly intelligent. It just follows four simple rules:
          </p>
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 font-mono text-sm space-y-2">
            <div className="text-cyan-300">if enemy.x &lt; player.x:</div>
            <div className="ml-4">enemy.x += enemy_speed</div>
            <div className="text-cyan-300 mt-3">if enemy.x &gt; player.x:</div>
            <div className="ml-4">enemy.x -= enemy_speed</div>
            <div className="text-cyan-300 mt-3">if enemy.y &lt; player.y:</div>
            <div className="ml-4">enemy.y += enemy_speed</div>
            <div className="text-cyan-300 mt-3">if enemy.y &gt; player.y:</div>
            <div className="ml-4">enemy.y -= enemy_speed</div>
          </div>
          <p className="text-slate-400 text-sm">\n            That is it! Four if statements. No loops, no complex math. Just: "If the enemy is to the left of the player, move right."
          </p>
        </CardContent>
      </Card>

      {/* Interactive Sandbox */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">Try It: Toggle the AI Switches</CardTitle>
          <CardDescription className="text-slate-300">Turn switches on/off to control which directions the enemy can move</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Canvas */}
          <div
            className="relative bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden w-full max-w-[500px]"
            style={{ height: CANVAS_HEIGHT }}
          >
            {/* Player (Cyan) */}
            <motion.div
              className="absolute bg-cyan-400 rounded flex items-center justify-center text-slate-900 font-bold text-xs"
              style={{
                left: playerPos.x,
                top: playerPos.y,
                width: 40,
                height: 40,
              }}
              animate={{
                boxShadow: "0 0 15px rgba(0, 217, 255, 0.6)",
              }}
            >
              You
            </motion.div>

            {/* Enemy (Red) */}
            <motion.div
              className="absolute bg-red-500 rounded flex items-center justify-center text-white font-bold text-xs"
              style={{
                left: enemyPos.x,
                top: enemyPos.y,
                width: 35,
                height: 35,
              }}
              animate={{
                boxShadow: "0 0 15px rgba(255, 68, 68, 0.6)",
              }}
            >
              AI
            </motion.div>
          </div>

          {/* Player Controls */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-3">Move yourself with arrow buttons:</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handlePlayerMove("left")}
                className="p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handlePlayerMove("up")}
                  className="p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handlePlayerMove("down")}
                  className="p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => handlePlayerMove("right")}
                className="p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* AI Brain Switches */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-4">
            <p className="text-slate-400 text-sm font-semibold">Enemy AI Switches:</p>

            <div className="grid grid-cols-2 gap-4">
              {/* Right Switch */}
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                <div className="flex items-center gap-2">
                  <ChevronRight className={`w-5 h-5 ${moveRight ? "text-green-400" : "text-slate-600"}`} />
                  <span className="text-sm text-slate-300">Move Right</span>
                </div>
                <Toggle
                  pressed={moveRight}
                  onPressedChange={setMoveRight}
                  className="bg-slate-700 data-[state=on]:bg-green-600"
                >
                  {moveRight ? "ON" : "OFF"}
                </Toggle>
              </div>

              {/* Left Switch */}
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                <div className="flex items-center gap-2">
                  <ChevronLeft className={`w-5 h-5 ${moveLeft ? "text-green-400" : "text-slate-600"}`} />
                  <span className="text-sm text-slate-300">Move Left</span>
                </div>
                <Toggle
                  pressed={moveLeft}
                  onPressedChange={setMoveLeft}
                  className="bg-slate-700 data-[state=on]:bg-green-600"
                >
                  {moveLeft ? "ON" : "OFF"}
                </Toggle>
              </div>

              {/* Down Switch */}
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                <div className="flex items-center gap-2">
                  <ChevronDown className={`w-5 h-5 ${moveDown ? "text-green-400" : "text-slate-600"}`} />
                  <span className="text-sm text-slate-300">Move Down</span>
                </div>
                <Toggle
                  pressed={moveDown}
                  onPressedChange={setMoveDown}
                  className="bg-slate-700 data-[state=on]:bg-green-600"
                >
                  {moveDown ? "ON" : "OFF"}
                </Toggle>
              </div>

              {/* Up Switch */}
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                <div className="flex items-center gap-2">
                  <ChevronUp className={`w-5 h-5 ${moveUp ? "text-green-400" : "text-slate-600"}`} />
                  <span className="text-sm text-slate-300">Move Up</span>
                </div>
                <Toggle
                  pressed={moveUp}
                  onPressedChange={setMoveUp}
                  className="bg-slate-700 data-[state=on]:bg-green-600"
                >
                  {moveUp ? "ON" : "OFF"}
                </Toggle>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Try turning off one switch. What happens? Try turning off all switches. The enemy becomes frozen!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <Card className="border-green-700/50 bg-green-900/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <p className="text-green-300 font-semibold mb-2">💡 Key Insight:</p>
          <p className="text-slate-200 text-sm">
            You just built an AI! The enemy is not intelligent—it just follows rules. Each switch is one if statement. When all switches are on, the enemy chases you. When you turn one off, it can no longer move in that direction.
          </p>
        </CardContent>
      </Card>
      {/* 🎯 Mission */}
      <Card className={`backdrop-blur-sm mt-6 border-2 transition-colors ${isMissionSuccess ? 'border-green-500 bg-green-900/40' : 'border-purple-700/50 bg-purple-900/20'}`}>
        <CardContent className="pt-6">
          <p className={`font-bold mb-2 flex items-center gap-2 ${isMissionSuccess ? 'text-green-400' : 'text-purple-300'}`}>
            🎯 Mission: Freeze the Enemy {isMissionSuccess && "— SUCCESS! 🎉"}
          </p>
          <p className="text-slate-200 text-sm">
            The enemy is too fast! Toggle the switches to completely freeze its AI so you can safely move around without it chasing you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
