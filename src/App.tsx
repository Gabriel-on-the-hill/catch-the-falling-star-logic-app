import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Zap, Brain, Lock, Eye } from "lucide-react";
import CollisionRadar from "@/components/modules/CollisionRadar";
import AIBrainSwitches from "@/components/modules/AIBrainSwitches";
import KitchenDoor from "@/components/modules/KitchenDoor";
import PredictAndVerify from "@/components/modules/PredictAndVerify";
import RandomSpawn from "@/components/modules/RandomSpawn";

export default function Home() {
  const [activeModule, setActiveModule] = useState("intro");
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const toggleModuleComplete = (moduleId: string) => {
    setCompletedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const modules = [
    {
      id: "collision",
      title: "Collision Radar",
      description: "Understand how colliderect() checks if two rectangles overlap",
      icon: <Zap className="w-5 h-5" />,
      duration: "3–4 min",
    },
    {
      id: "ai-brain",
      title: "AI Brain Switches",
      description: "See how 4 simple if statements make an enemy chase the player",
      icon: <Brain className="w-5 h-5" />,
      duration: "3–4 min",
    },
    {
      id: "kitchen-door",
      title: "The Kitchen Door",
      description: "Visualize how the global keyword unlocks access to variables",
      icon: <Lock className="w-5 h-5" />,
      duration: "2–3 min",
    },
    {
      id: "random-spawn",
      title: "Random Spawn",
      description: "See how random numbers make the game unpredictable",
      icon: <Zap className="w-5 h-5" />,
      duration: "2 min",
    },
    {
      id: "predict",
      title: "Exit Ticket",
      description: "Predict what happens next in the game, then step through to check",
      icon: <Eye className="w-5 h-5" />,
      duration: "5 min",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400">⭐ Logic Lab</h1>
              <p className="text-sm text-slate-400 mt-1">Catch the Star: Learn Game Logic Before You Code</p>
            </div>
            <div className="text-right text-sm text-slate-400">
              {completedModules.size} of {modules.length} modules complete
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
          {/* Tab List */}
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 gap-2 mb-8 bg-slate-800/50 p-2 rounded-lg">
            <TabsTrigger value="intro" className="text-xs md:text-sm">Intro</TabsTrigger>
            {modules.map((module) => (
              <TabsTrigger
                key={module.id}
                value={module.id}
                className={`text-xs md:text-sm ${completedModules.has(module.id) ? "bg-green-900/30 text-green-300" : ""
                  }`}
              >
                {completedModules.has(module.id) ? "✓ " : ""}{module.title.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Intro Tab */}
          <TabsContent value="intro" className="space-y-6">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-400">Welcome to Logic Lab</CardTitle>
                <CardDescription className="text-slate-300">A hands-on sandbox to understand game logic before you code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-200">
                <p>
                  In this 60-minute class, you'll build a game called <strong>"Catch the Falling Star."</strong> But before you open Thonny, you need to understand the logic that makes games work.
                </p>
                <p>
                  This Lab has 4 interactive modules. Each one teaches a core concept by letting you <strong>see the logic in action</strong> and <strong>predict what happens next.</strong>
                </p>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-3 mt-6">
                  <h3 className="font-semibold text-cyan-300">The 4 Concepts You'll Master:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="text-gold-400 font-bold">1.</span>
                      <span><strong>Collision Detection:</strong> How does the computer know if you caught the star?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-400 font-bold">2.</span>
                      <span><strong>AI Chase Logic:</strong> How does an enemy decide to move toward you?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-400 font-bold">3.</span>
                      <span><strong>Global Variables:</strong> How does the game remember your score?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold-400 font-bold">4.</span>
                      <span><strong>Game State:</strong> How do all these pieces work together?</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <p className="text-sm text-slate-400 mb-4">⏱️ <strong>Estimated time:</strong> 15–20 minutes to complete all modules</p>
                  <Button
                    onClick={() => setActiveModule("collision")}
                    className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold"
                  >
                    Start Module 1: Collision Radar <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Module Tabs */}
          {modules.map((module) => (
            <TabsContent key={module.id} value={module.id} className="space-y-6">
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-cyan-400 mt-1">{module.icon}</div>
                      <div>
                        <CardTitle className="text-2xl text-cyan-400">{module.title}</CardTitle>
                        <CardDescription className="text-slate-300 mt-2">{module.description}</CardDescription>
                      </div>
                    </div>
                    <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">{module.duration}</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Module Content */}
              <div className="space-y-6">
                {module.id === "collision" && <CollisionRadar />}
                {module.id === "ai-brain" && <AIBrainSwitches />}
                {module.id === "kitchen-door" && <KitchenDoor />}
                {module.id === "random-spawn" && <RandomSpawn />}
                {module.id === "predict" && <PredictAndVerify />}
              </div>

              {/* Module Footer */}
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Did you understand this concept?</p>
                    <Button
                      onClick={() => toggleModuleComplete(module.id)}
                      variant={completedModules.has(module.id) ? "default" : "outline"}
                      className={completedModules.has(module.id) ? "bg-green-600 hover:bg-green-700" : "border-slate-600"}
                    >
                      {completedModules.has(module.id) ? "✓ Got It!" : "Mark as Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex gap-3 justify-between">
                <Button
                  onClick={() => {
                    const currentIndex = modules.findIndex((m) => m.id === module.id);
                    if (currentIndex > 0) setActiveModule(modules[currentIndex - 1].id);
                  }}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  disabled={modules.findIndex((m) => m.id === module.id) === 0}
                >
                  ← Previous
                </Button>
                <Button
                  onClick={() => {
                    const currentIndex = modules.findIndex((m) => m.id === module.id);
                    if (currentIndex < modules.length - 1) setActiveModule(modules[currentIndex + 1].id);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold"
                  disabled={modules.findIndex((m) => m.id === module.id) === modules.length - 1}
                >
                  Next →
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
