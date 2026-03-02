import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface GameState {
  playerX: number;
  playerY: number;
  starX: number;
  starY: number;
  score: number;
  lives: number;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  initialState: GameState;
  playerMovement: "none" | "left" | "right" | "up" | "down";
  starMovement: "none" | "down" | "respawn";
  enemyCollision?: boolean;
  expectedChanges: Partial<GameState>;
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    id: "scenario-1",
    title: "Scenario 1: Moving Right",
    description: "The player presses the right arrow key. What happens to playerX?",
    initialState: { playerX: 200, playerY: 450, starX: 300, starY: 100, score: 0, lives: 3 },
    playerMovement: "right",
    starMovement: "none",
    expectedChanges: { playerX: 205 },
    explanation: "The player moves right by 5 pixels (the speed value). playerX goes from 200 to 205.",
  },
  {
    id: "scenario-2",
    title: "Scenario 2: Star Falls",
    description: "The star is falling. What happens to starY?",
    initialState: { playerX: 200, playerY: 450, starX: 300, starY: 100, score: 0, lives: 3 },
    playerMovement: "none",
    starMovement: "down",
    expectedChanges: { starY: 103 },
    explanation: "The star falls by 3 pixels per frame (star_speed = 3). starY goes from 100 to 103.",
  },
  {
    id: "scenario-3",
    title: "Scenario 3: Catching the Star",
    description: "The player and star are at the same position. What happens to score & the star?",
    initialState: { playerX: 200, playerY: 450, starX: 200, starY: 450, score: 5, lives: 3 },
    playerMovement: "none",
    starMovement: "respawn",
    expectedChanges: { score: 6, starY: 0, starX: 150 }, // Randomly saying 150 for this scenario
    explanation: "Collision detected! The score increases by 1. The star respawns at the top (y = 0) at a random x coordinate.",
  },
  {
    id: "scenario-4",
    title: "Scenario 4: Enemy Catches Player",
    description: "The enemy touches the player. What happens to lives?",
    initialState: { playerX: 200, playerY: 200, starX: 300, starY: 100, score: 10, lives: 2 },
    playerMovement: "none",
    starMovement: "none",
    enemyCollision: true,
    expectedChanges: { lives: 1 },
    explanation: "When player.colliderect(enemy) is true, lives decreases by 1.",
  },
  {
    id: "scenario-5",
    title: "Scenario 5: Multi-Variable (Move & Fall)",
    description: "The player moves left WHILE the star falls. Track both changes.",
    initialState: { playerX: 200, playerY: 450, starX: 300, starY: 100, score: 0, lives: 3 },
    playerMovement: "left",
    starMovement: "down",
    expectedChanges: { playerX: 195, starY: 103 },
    explanation: "Game logic happens concurrently. The player moves left (-5x) AND the star falls (+3y) in the same frame.",
  },
  {
    id: "scenario-6",
    title: "Scenario 6: Star Hits the Floor",
    description: "The star falls past the bottom of the screen (y > 500). What happens?",
    initialState: { playerX: 200, playerY: 450, starX: 300, starY: 502, score: 4, lives: 3 },
    playerMovement: "none",
    starMovement: "respawn",
    expectedChanges: { starY: 0, starX: 400 },
    explanation: "When the star hits the floor, it resets back to the top (y=0) at a new random x-coordinate, just like when you catch it.",
  },
  {
    id: "scenario-7",
    title: "Scenario 7: The Chase",
    description: "Enemy is at (100, 100). Player is at (105, 105). They are not touching yet. What happens to lives?",
    initialState: { playerX: 105, playerY: 105, starX: 300, starY: 100, score: 10, lives: 3 },
    playerMovement: "none",
    starMovement: "none",
    enemyCollision: false,
    expectedChanges: { lives: 3 },
    explanation: "No collision yet! Even if they are very close, colliderect() only triggers if the rectangles actually overlap. Lives remain unchanged.",
  },
  {
    id: "scenario-8",
    title: "EXIT TICKET: The Ultimate Frame",
    description: "Player moves UP, catches a star, AND gets hit by an enemy in the same exact frame. Calculate EVERYTHING.",
    initialState: { playerX: 200, playerY: 400, starX: 200, starY: 395, score: 19, lives: 2 },
    playerMovement: "up",
    starMovement: "respawn",
    enemyCollision: true,
    expectedChanges: { playerY: 395, score: 20, starY: 0, starX: 50, lives: 1 },
    explanation: "The ultimate synthesis! Player moves up (-5y), they catch the star (+1 score, star respawns top), AND the enemy hits them (-1 life). All of this happens instantly inside one update() call.",
  },
];

export default function PredictAndVerify() {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userPredictions, setUserPredictions] = useState<Record<string, Record<string, number>>>({});
  const [revealed, setRevealed] = useState(false);

  const scenario = scenarios[currentScenarioIndex];

  const calculateNextState = (state: GameState, scenario: Scenario): GameState => {
    const newState = { ...state };

    // Player movement
    if (scenario.playerMovement === "right") newState.playerX += 5;
    if (scenario.playerMovement === "left") newState.playerX -= 5;
    if (scenario.playerMovement === "down") newState.playerY += 5;
    if (scenario.playerMovement === "up") newState.playerY -= 5;

    // Star movement
    if (scenario.starMovement === "down") {
      newState.starY += 3;
    } else if (scenario.starMovement === "respawn") {
      newState.starY = scenario.expectedChanges.starY || 0;
      newState.starX = scenario.expectedChanges.starX || newState.starX;
      // Also apply score change if this was a catch
      if (scenario.expectedChanges.score) {
        newState.score = scenario.expectedChanges.score;
      }
    }

    if (scenario.enemyCollision) {
      newState.lives -= 1;
    }

    return newState;
  };

  const nextState = calculateNextState(scenario.initialState, scenario);

  const handlePrediction = (key: string, value: number) => {
    setUserPredictions((prev) => ({
      ...prev,
      [scenario.id]: {
        ...prev[scenario.id],
        [key]: value,
      },
    }));
  };

  const userPredictionForScenario = userPredictions[scenario.id] || {};

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleNext = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setRevealed(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Explanation */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">Predict & Verify: Game State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-200">
          <p>
            Game logic is about predicting state changes. Each frame, the <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300">update()</code> function changes the game state based on player input and collisions.
          </p>
          <p>
            In the next scenarios, you will predict what happens to the game state after one frame. Then you will reveal the answer to check your understanding.
          </p>
        </CardContent>
      </Card>

      {/* Scenario */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">
            {scenario.title}
          </CardTitle>
          <CardDescription className="text-slate-300">{scenario.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Initial State */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm font-semibold mb-3">Initial State (Frame N):</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-slate-800 rounded p-3">
                <p className="text-slate-500 text-xs">playerX</p>
                <p className="text-cyan-400 font-bold text-lg">{scenario.initialState.playerX}</p>
              </div>
              <div className="bg-slate-800 rounded p-3">
                <p className="text-slate-500 text-xs">playerY</p>
                <p className="text-cyan-400 font-bold text-lg">{scenario.initialState.playerY}</p>
              </div>
              <div className="bg-slate-800 rounded p-3">
                <p className="text-slate-500 text-xs">starX</p>
                <p className="text-yellow-400 font-bold text-lg">{scenario.initialState.starX}</p>
              </div>
              <div className="bg-slate-800 rounded p-3">
                <p className="text-slate-500 text-xs">starY</p>
                <p className="text-yellow-400 font-bold text-lg">{scenario.initialState.starY}</p>
              </div>
              <div className="bg-slate-800 rounded p-3">
                <p className="text-slate-500 text-xs">score</p>
                <p className="text-green-400 font-bold text-lg">{scenario.initialState.score}</p>
              </div>
              <div className="bg-slate-800 rounded p-3">
                <p className="text-slate-500 text-xs">lives</p>
                <p className="text-red-400 font-bold text-lg">{scenario.initialState.lives}</p>
              </div>
            </div>
          </div>

          {/* What Happens */}
          <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm font-semibold mb-2">What Happens:</p>
            <p className="text-slate-300 text-sm">{scenario.description}</p>
            {scenario.playerMovement !== "none" && (
              <p className="text-cyan-400 text-sm mt-2">
                Player moves: <strong>{scenario.playerMovement.toUpperCase()}</strong>
              </p>
            )}
            {scenario.starMovement !== "none" && (
              <p className="text-yellow-400 text-sm mt-2">
                Star moves: <strong>{scenario.starMovement.toUpperCase()}</strong>
              </p>
            )}
          </div>

          {/* Prediction Section */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm font-semibold mb-4">
              Your Prediction (Frame N+1):
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(scenario.initialState).map(([key, value]) => (
                <div key={key} className="bg-slate-800 rounded p-3">
                  <p className="text-slate-500 text-xs">{key}</p>
                  <input
                    type="number"
                    value={userPredictionForScenario[key] ?? ""}
                    onChange={(e) => handlePrediction(key, parseInt(e.target.value) || 0)}
                    placeholder={String(value)}
                    className="w-full bg-slate-700 text-white font-bold text-lg rounded px-2 py-1 mt-1 border border-slate-600 focus:border-cyan-400 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Reveal Button */}
          <Button
            onClick={handleReveal}
            disabled={revealed}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold"
          >
            {revealed ? "✓ Revealed" : "Step & Reveal Answer"}
          </Button>

          {/* Revealed Answer */}
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm font-semibold mb-3">Correct Answer (Frame N+1):</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(nextState).map(([key, value]) => {
                    const userValue = userPredictionForScenario[key];
                    const isCorrect = userValue === value;
                    return (
                      <div
                        key={key}
                        className={`rounded p-3 border ${isCorrect
                          ? "bg-green-900/30 border-green-700"
                          : userValue !== undefined
                            ? "bg-red-900/30 border-red-700"
                            : "bg-slate-800 border-slate-600"
                          }`}
                      >
                        <p className="text-slate-500 text-xs">{key}</p>
                        <p className="font-bold text-lg text-white">{value}</p>
                        {userValue !== undefined && (
                          <p className={`text-xs mt-1 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                            {isCorrect ? "✓ Correct!" : `You predicted: ${userValue}`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                <p className="text-green-300 font-semibold mb-2">💡 Explanation:</p>
                <p className="text-slate-200 text-sm">{scenario.explanation}</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          Scenario {currentScenarioIndex + 1} of {scenarios.length}
        </p>
        <Button
          onClick={handleNext}
          disabled={!revealed || currentScenarioIndex === scenarios.length - 1}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold"
        >
          Next Scenario <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Summary */}
      {currentScenarioIndex === scenarios.length - 1 && revealed && (
        <Card className="border-green-700/50 bg-green-900/20 backdrop-blur-sm">
          <CardContent className="pt-6">
            <p className="text-green-300 font-semibold mb-2">✓ You have completed all scenarios!</p>
            <p className="text-slate-200 text-sm">
              You now understand how game state changes frame by frame. Each frame, the <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300">update()</code> function reads input, calculates new positions, checks collisions, and updates the score. That is the entire game loop!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
