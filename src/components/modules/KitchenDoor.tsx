import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Toggle } from "@/components/ui/toggle";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function KitchenDoor() {
  const [isGlobal, setIsGlobal] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptedUpdate, setAttemptedUpdate] = useState(false);
  const [hasSeenError, setHasSeenError] = useState(false);

  const handleTryUpdateScore = () => {
    setAttemptedUpdate(true);
    if (!isGlobal) {
      setHasSeenError(true);
    } else {
      setScore(score + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Explanation */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">The Problem: Updating Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-200">
          <p>
            In your game, the score is defined outside the <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300">update()</code> function:
          </p>
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 font-mono text-sm space-y-2">
            <div className="text-cyan-300">score = 0  # Outside update()</div>
            <div className="text-slate-400 mt-3">def update():</div>
            <div className="ml-4 text-red-400">score += 1  # ERROR!</div>
          </div>
          <p className="text-slate-400 text-sm">
            Python sees <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300">score += 1</code> inside the function and thinks: "This is a new local variable. I have never heard of this score before!"
          </p>
          <p>
            The solution is to tell Python: <strong>"Use the score from outside the function."</strong> That is what <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300">global</code> does.
          </p>
        </CardContent>
      </Card>

      {/* The Kitchen Door Analogy */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">The Kitchen Door Analogy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-200">
          <p>
            Imagine <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300">update()</code> is a room with a closed door. Outside the room is a kitchen with a cookie jar (your score).
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">✗</span>
              <span><strong>Without global:</strong> The door is locked. You cannot reach the jar. You try to update score, but Python creates a new jar inside the room instead. Error!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">✓</span>
              <span><strong>With global:</strong> The door opens. You can reach the jar in the kitchen. You update the real score.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Interactive Sandbox */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">Try It: Open the Kitchen Door</CardTitle>
          <CardDescription className="text-slate-300">Toggle global to unlock access to the score jar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Representation */}
          <div className="space-y-4">
            {/* The Room (update function) */}
            <div className="border-2 border-slate-700 rounded-lg p-6 bg-slate-900/30">
              <p className="text-slate-400 text-sm font-mono mb-4">def update():</p>

              {/* The Door */}
              <motion.div
                className="relative h-32 mb-4 bg-slate-800 rounded-lg border-2 border-slate-700 flex items-center justify-center overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-center"
                  animate={{
                    x: isGlobal ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center">
                    <p className="text-slate-400 font-semibold">🚪 Door</p>
                    <p className={`text-sm mt-2 ${isGlobal ? "text-green-400" : "text-red-400"}`}>
                      {isGlobal ? "OPEN ✓" : "LOCKED ✗"}
                    </p>
                  </div>
                </motion.div>

                {/* Kitchen view (visible when door opens) */}
                {isGlobal && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-center">
                      <p className="text-2xl">🏠 Kitchen</p>
                      <p className="text-slate-300 text-sm mt-2">Score Jar: {score}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: hasSeenError ? 1 : 0.5, height: 'auto' }}
                className={`flex items-center justify-between p-4 bg-slate-800 rounded border border-slate-700 transition-opacity ${hasSeenError ? '' : 'pointer-events-none'}`}
              >
                <div>
                  <p className="text-slate-300 font-mono text-sm">global score</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {hasSeenError ? "Opens the kitchen door" : "Locked. Try updating the score first."}
                  </p>
                </div>
                <Toggle
                  pressed={isGlobal}
                  onPressedChange={setIsGlobal}
                  className="bg-slate-700 data-[state=on]:bg-green-600"
                  disabled={!hasSeenError}
                >
                  {isGlobal ? "ON" : "OFF"}
                </Toggle>
              </motion.div>
            </div>

            {/* Try to Update Score */}
            <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm font-mono mb-4">score += 1</p>
              <button
                onClick={handleTryUpdateScore}
                className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded transition"
              >
                Try to Update Score
              </button>

              {/* Result */}
              {attemptedUpdate && (
                <motion.div
                  className="mt-4 p-4 rounded-lg flex items-start gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {isGlobal ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-400 font-semibold">Success!</p>
                        <p className="text-slate-300 text-sm">The door was open. Score updated to {score}.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-semibold">UnboundLocalError!</p>
                        <p className="text-slate-300 text-sm">The door was locked. Python tried to create a new score inside the room, but it does not exist yet.</p>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Current Score Display */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-2">Current Score (in Kitchen):</p>
            <p className="text-4xl font-bold text-cyan-400">{score}</p>
          </div>
        </CardContent>
      </Card>

      {/* The Code Solution */}
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">The Code Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 font-mono text-sm space-y-2">
            <div className="text-cyan-300">def update():</div>
            <div className="ml-4 text-green-400">global score  # Open the door!</div>
            <div className="ml-4">score += 1</div>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            That single line—<code className="bg-slate-900 px-2 py-1 rounded text-cyan-300">global score</code>—tells Python to use the score from outside the function.
          </p>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <Card className="border-green-700/50 bg-green-900/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <p className="text-green-300 font-semibold mb-2">💡 Key Insight:</p>
          <p className="text-slate-200 text-sm">
            <code className="bg-slate-900 px-2 py-1 rounded text-cyan-300">global</code> is not magic. It is just a pass that lets a function access variables defined outside of it. Without it, Python assumes all variables inside a function are local (created inside that function).
          </p>
        </CardContent>
      </Card>
      {/* 🎯 Mission */}
      <Card className={`backdrop-blur-sm mt-6 border-2 transition-colors ${score > 0 ? 'border-green-500 bg-green-900/40' : 'border-purple-700/50 bg-purple-900/20'}`}>
        <CardContent className="pt-6">
          <p className={`font-bold mb-2 flex items-center gap-2 ${score > 0 ? 'text-green-400' : 'text-purple-300'}`}>
            🎯 Mission: Steal a Cookie {score > 0 && "— SUCCESS! 🎉"}
          </p>
          <p className="text-slate-200 text-sm">
            Try to update the score. When you get an error, figure out how to open the door to access the score jar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
