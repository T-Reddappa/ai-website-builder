import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TEMPLATE_SUGGESTIONS = [
  "Create me a todo app",
  "Build a portfolio website with React",
  "Create a project management tool with Express",
  "Design an e-commerce site",
  "Design a real estate listing site",
  "Create a music streaming platform with Node.js",
];

export function Home() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate("/builder", { state: { prompt: prompt } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a]">
      {/* <LightRays /> */}
      <div className="text-xl font-semibold text-gray-100 px-5 z-10 absolute py-4 flex items-center tracking-[2px] font-mono">
        BuildB<span className="text-sm">🤖</span>t
      </div>
      <div className="max-w-4xl mx-auto px-4 z-1 grid place-content-center min-h-screen">
        {/* Hero Section */}
        <h1 className="text-5xl font-bold text-white text-center mb-4">
          What do you want to build?
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Prompt, run, and edit web apps.
        </p>

        {/* Prompt Input */}
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="relative max-w-xl mx-auto">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="How can BuildBot help you today?"
              className="w-full h-32 text-sm bg-[#1e1e1e] text-gray-200 rounded-lg p-4 pl-4 pr-12 
                    border border-gray-700 focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/30
                    transition-all duration-200 resize-none"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                type="button"
                className="p-2 hover:bg-gray-700 rounded-md transition-colors"
                title="Create"
                onClick={handleSubmit}
              >
                <ArrowRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TEMPLATE_SUGGESTIONS.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setPrompt(suggestion)}
              className="px-2 text-xs py-1 border border-gray-700 text-gray-300 rounded-full 
                   hover:bg-gray-800 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
