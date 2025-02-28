'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Grid, Info, BookOpen, Brain, LineChart } from 'lucide-react';
import Header from '@/components/Header';

// Types for our model configuration
type ModelId = 'claude' | 'gpt' | 'grok' | 'gemini';

interface Stage {
  words: number;
  prompt: string;
  instruction: string;
}

interface Model {
  name: string;
  color: string;
  stages: Stage[];
}

interface Models {
  [key: string]: Model;
}

interface ActiveStages {
  claude: number;
  gpt: number;
  grok: number;
  gemini: number;
}

const SemanticCompressionBlog = () => {
  const [viewMode, setViewMode] = useState('carousel');
  const [activeStages, setActiveStages] = useState<ActiveStages>({
    claude: 0,
    gpt: 0,
    grok: 0,
    gemini: 0
  });
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStageChange = (modelId: ModelId, direction: number) => {
    setIsTransitioning(true);
    setActiveStages(prev => ({
      ...prev,
      [modelId]: Math.max(0, Math.min(3, prev[modelId] + direction))
    }));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Compression cards configuration
  const models: Models = {
    claude: {
      name: "Claude-3",
      color: "bg-purple-100 dark:bg-purple-900",
      stages: [
        {
          words: 150,
          prompt: "A majestic mountain range stretches across the horizon, its snow-capped peaks piercing through wispy clouds. The jagged ridges cast long shadows across verdant valleys below, where ancient forests carpet the landscape in deep emerald. A crystalline lake mirrors the scene like polished glass, its surface occasionally disturbed by gentle ripples. The air is crisp and thin, carrying the subtle scent of pine and wild flowers. In the distance, a solitary eagle soars on thermal currents, its wingspan impressive against the vast canvas of sky.",
          instruction: "Create a detailed landscape description."
        },
        {
          words: 100,
          prompt: "Snow-capped mountains pierce through clouds on the horizon, casting shadows over green valleys below. A clear lake mirrors the landscape, while forests of pine stretch endlessly. High above, an eagle rides thermal currents, surveying the pristine wilderness beneath its wings.",
          instruction: "Compress while maintaining key visual elements."
        },
        {
          words: 50,
          prompt: "Majestic mountains rise above forested valleys, their snowy peaks reflected in a serene lake. An eagle soars overhead, completing the picture of untouched wilderness.",
          instruction: "Further compress while keeping core imagery."
        },
        {
          words: 25,
          prompt: "Snow-capped peaks tower over a pristine lake and forest, as an eagle circles above.",
          instruction: "Minimal viable description."
        }
      ]
    },
    gpt: {
      name: "GPT-4",
      color: "bg-green-100 dark:bg-green-900",
      stages: [
        {
          words: 150,
          prompt: "A tranquil mountain lake reflects the surrounding peaks like a natural mirror, its surface occasionally rippled by a gentle breeze. Dense pine forests climb the mountainsides, their dark green needles contrasting with patches of wildflowers in sunny meadows. The mountains themselves wear crowns of eternal snow, their granite faces weathered by countless seasons. The air carries the pure scent of wilderness, while overhead, puffy clouds cast moving shadows across the landscape.",
          instruction: "Create a detailed landscape description."
        },
        {
          words: 100,
          prompt: "A mountain lake mirrors snow-capped peaks, surrounded by dense pine forests and flowering meadows. The pristine wilderness extends in every direction, with clouds casting shifting shadows across the rugged terrain. Clean mountain air carries the scent of pine and wildflowers.",
          instruction: "Compress while maintaining key visual elements."
        },
        {
          words: 50,
          prompt: "A serene lake reflects snow-covered mountains, while pine forests and meadows dot the landscape. Clouds cast shadows below, completing the wilderness scene.",
          instruction: "Further compress while keeping core imagery."
        },
        {
          words: 25,
          prompt: "Mountains and forests surround a mirror-like lake, nature's beauty perfectly preserved.",
          instruction: "Minimal viable description."
        }
      ]
    },
    grok: {
      name: "Grok-1",
      color: "bg-blue-100 dark:bg-blue-900",
      stages: [
        {
          words: 150,
          prompt: "The mountain landscape unfolds like a masterpiece, with towering peaks draped in pristine snow reaching toward an azure sky. In the valley below, a vast forest of evergreens creates a tapestry of deep greens, broken only by the silver thread of a meandering river. The air is thin and sharp, carrying the crisp scent of pine and snow. Sunlight plays across the scene, highlighting rocky outcrops and casting long shadows across the untamed wilderness.",
          instruction: "Create a detailed landscape description."
        },
        {
          words: 100,
          prompt: "Snow-covered mountains rise majestically against blue skies, overlooking a valley filled with evergreen forests. A silver river winds through the landscape, while sunlight illuminates rocky outcrops and creates dramatic shadows. The air is crisp with the scent of pine.",
          instruction: "Compress while maintaining key visual elements."
        },
        {
          words: 50,
          prompt: "Snowy peaks tower above a forested valley, where a river winds like silver ribbon. Sunlight highlights the untamed wilderness below.",
          instruction: "Further compress while keeping core imagery."
        },
        {
          words: 25,
          prompt: "Mountains rise above a forest valley, crossed by a winding river.",
          instruction: "Minimal viable description."
        }
      ]
    },
    gemini: {
      name: "Gemini Pro",
      color: "bg-teal-100 dark:bg-teal-900",
      stages: [
        {
          words: 150,
          prompt: "Before me stretches a breathtaking alpine vista, where jagged mountain peaks pierce the clouds like ancient stone sentinels. Their slopes are blanketed in pristine snow that sparkles in the clear mountain light. Dense forests of pine and fir carpet the valleys, their deep green canopy swaying gently in the high-altitude breeze. A crystal-clear river serpentines through the landscape, its waters reflecting the azure sky above.",
          instruction: "Create a detailed landscape description."
        },
        {
          words: 100,
          prompt: "Snow-capped mountains rise dramatically into the clouds, overlooking valleys thick with pine and fir forests. A clear river winds through the landscape, reflecting the sky above. The mountain air carries the fresh scent of evergreens and snow.",
          instruction: "Compress while maintaining key visual elements."
        },
        {
          words: 50,
          prompt: "Majestic peaks covered in snow tower over forested valleys. A clear river weaves through the landscape, mirroring the sky overhead.",
          instruction: "Further compress while keeping core imagery."
        },
        {
          words: 25,
          prompt: "Snow-covered peaks rise above forests and a winding river below.",
          instruction: "Minimal viable description."
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-100 via-blue-100 to-green-100 dark:from-purple-900 dark:via-blue-900 dark:to-green-900 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Semantic Compression Study</h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 max-w-2xl">
            Exploring how frontier AI models maintain meaning while reducing complexity.
          </p>
        </div>
      </div>

      {/* Interactive Cards Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top row: Claude and GPT-4 */}
            {['claude', 'gpt'].map((modelId) => (
              <Card key={modelId} className="group bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 ease-in-out hover:shadow-lg">
                <CardContent className="p-6 relative">
                  {/* Model Header with Stage Indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`px-4 py-2 rounded-lg ${models[modelId].color} transition-colors duration-300`}>
                      <h2 className="font-medium text-gray-800 dark:text-gray-100">{models[modelId].name}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3].map((stage) => (
                        <div 
                          key={stage}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            stage === activeStages[modelId as ModelId]
                              ? `${models[modelId].color} scale-125`
                              : stage < activeStages[modelId as ModelId]
                              ? 'bg-gray-300 dark:bg-gray-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Image Container with Overlay */}
                  <div className="relative mb-6 overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <div className={`absolute inset-0 ${models[modelId].color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                    <div className="aspect-square bg-gray-100 dark:bg-gray-600 overflow-hidden h-64">
                      <img
                        src="/api/placeholder/200/200"
                        alt={`${models[modelId].name} generation`}
                        className={`w-full h-full object-cover transform transition-all duration-300 ${
                          isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
                        } group-hover:scale-105`}
                      />
                    </div>
                  </div>

                  {/* Word Count and Navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-600 transition-all duration-300 group-hover:shadow-md"
                      onClick={() => handleStageChange(modelId as ModelId, -1)}
                      disabled={activeStages[modelId as ModelId] === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Compression Level</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold transition-all duration-300">
                          {models[modelId].stages[activeStages[modelId as ModelId]].words}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">words</span>
                      </div>
                    </div>
                    <button
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-600 transition-all duration-300 group-hover:shadow-md"
                      onClick={() => handleStageChange(modelId as ModelId, 1)}
                      disabled={activeStages[modelId as ModelId] === 3}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Prompt Text with Scroll Indicator */}
                  <div className="relative">
                    <div className="absolute right-0 top-0 w-6 h-full bg-gradient-to-l from-white dark:from-gray-700 to-transparent pointer-events-none z-10" />
                    <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed h-24 overflow-y-auto pr-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent">
                        {models[modelId].stages[activeStages[modelId as ModelId]].prompt}
                      </p>
                    </div>
                  </div>

                  {/* Stage Label */}
                  <div className="absolute top-6 right-6 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Stage {activeStages[modelId as ModelId] + 1} of 4
                  </div>
                </CardContent>
              </Card>
            ))}
            {/* Bottom row: Grok and Gemini */}
            {['grok', 'gemini'].map((modelId) => (
              <Card key={modelId} className="group bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 ease-in-out hover:shadow-lg">
                <CardContent className="p-6 relative">
                  {/* Model Header with Stage Indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`px-4 py-2 rounded-lg ${models[modelId].color} transition-colors duration-300`}>
                      <h2 className="font-medium text-gray-800 dark:text-gray-100">{models[modelId].name}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3].map((stage) => (
                        <div 
                          key={stage}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            stage === activeStages[modelId as ModelId]
                              ? `${models[modelId].color} scale-125`
                              : stage < activeStages[modelId as ModelId]
                              ? 'bg-gray-300 dark:bg-gray-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Image Container with Overlay */}
                  <div className="relative mb-6 overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <div className={`absolute inset-0 ${models[modelId].color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                    <div className="aspect-square bg-gray-100 dark:bg-gray-600 overflow-hidden h-48">
                      <img
                        src="/api/placeholder/200/200"
                        alt={`${models[modelId].name} generation`}
                        className={`w-full h-full object-cover transform transition-all duration-300 ${
                          isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
                        } group-hover:scale-105`}
                      />
                    </div>
                  </div>

                  {/* Word Count and Navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-600 transition-all duration-300 group-hover:shadow-md"
                      onClick={() => handleStageChange(modelId as ModelId, -1)}
                      disabled={activeStages[modelId as ModelId] === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Compression Level</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold transition-all duration-300">
                          {models[modelId].stages[activeStages[modelId as ModelId]].words}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">words</span>
                      </div>
                    </div>
                    <button
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-600 transition-all duration-300 group-hover:shadow-md"
                      onClick={() => handleStageChange(modelId as ModelId, 1)}
                      disabled={activeStages[modelId as ModelId] === 3}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Prompt Text with Scroll Indicator */}
                  <div className="relative">
                    <div className="absolute right-0 top-0 w-6 h-full bg-gradient-to-l from-white dark:from-gray-700 to-transparent pointer-events-none z-10" />
                    <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed h-24 overflow-y-auto pr-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent">
                        {models[modelId].stages[activeStages[modelId as ModelId]].prompt}
                      </p>
                    </div>
                  </div>

                  {/* Stage Label */}
                  <div className="absolute top-6 right-6 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Stage {activeStages[modelId as ModelId] + 1} of 4
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Blog Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg dark:prose-invert">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              Understanding Semantic Compression
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              As AI language models become increasingly sophisticated, their ability to maintain semantic 
              fidelity while reducing text length opens exciting possibilities for summarization, 
              creative writing, and more. In this project, we define <em>semantic compression</em> as the 
              process by which an LLM preserves core meaning and emotional resonance even as the word 
              count plummets. 
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Since resource-heavy human evaluations aren't always practical, we're using 
              <strong> text-to-image outputs</strong> as a quick, visual proxy: if a compressed description 
              can still guide a generative model to produce a scene with similar objects and mood, we assume 
              key meaning has been preserved.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Brain className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              Methodology
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We compare <strong>four</strong> frontier models—Claude-3, GPT-4, Grok-1, and Gemini Pro.
                Each model is prompted with an initial ~150-word landscape description and then asked to 
                progressively compress it to 100, 50, and finally 25 words. The text at each stage can be 
                passed into a text-to-image system (like DALL·E 2) to see if major visual details and 
                atmosphere persist.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                This approach avoids large-scale human judgment. Instead, we rely on the idea that 
                <em> if the compressed prompt loses key details, the generated images will differ 
                noticeably from those based on the original text.</em> While not a perfect measure, 
                this technique provides a clear, easily shared demonstration of semantic retention 
                or loss.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                For a quick snapshot: the interactive cards above let you flip through each 
                compression stage. In a future iteration, we plan to replace the placeholder images 
                with actual text-to-image results.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <LineChart className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              Key Findings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Compression Patterns</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Each model exhibits distinct priorities in how it trims details. Some preserve 
                  vivid imagery (e.g., references to color, mood), while others focus on key nouns 
                  and verbs. Progressively shorter prompts risk losing subtle emotional cues.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Visual Consistency via Text-to-Image
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  By comparing generated images, we can see when crucial landscape elements 
                  (like a lone eagle or specific lighting) vanish. While this does not replace 
                  human semantic judgments, it offers a low-cost, automated signal for whether 
                  core descriptive elements remain intact.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Next Steps & Limitations</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>
                <strong>Embedding Similarity:</strong> Future iterations could compare 
                text or image embeddings (e.g., CLIP) for a more quantitative measure of 
                "closeness" between original and compressed prompts.
              </li>
              <li>
                <strong>Multiple Domains:</strong> Here we focused on landscapes for visual clarity. 
                Testing more abstract or emotional writing (e.g., poetry) could reveal different 
                compression behaviors.
              </li>
              <li>
                <strong>Text-to-Image Biases:</strong> TTI models can introduce artifacts 
                or omit certain details, so we remain cautious about treating the outputs 
                as definitive proof of semantic understanding.
              </li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
};

export default SemanticCompressionBlog;
