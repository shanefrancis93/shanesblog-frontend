"use client";

import React from "react";
import Image from "next/image";
import { Poem, LLMType } from "@/data/poems";

interface PoemAIGalleryProps {
  poem: Poem;
  isChanging?: boolean;
}

const llmInfo: Record<LLMType, { name: string; color: string }> = {
  claude: {
    name: "Claude",
    color: "bg-purple-100 dark:bg-purple-900",
  },
  gpt: {
    name: "GPT-4",
    color: "bg-green-100 dark:bg-green-900",
  },
  gemini: {
    name: "Gemini",
    color: "bg-blue-100 dark:bg-blue-900",
  },
};

export const PoemAIGallery: React.FC<PoemAIGalleryProps> = ({
  poem,
  isChanging = false,
}) => {
  if (!poem.llm_analysis) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <span className="text-gray-400">No AI analysis available</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {Object.entries(poem.llm_analysis).map(([llmType, analysis]) => {
        const { name, color } = llmInfo[llmType as LLMType];
        if (!analysis.analysis.image_prompt) return null;

        return (
          <div
            key={llmType}
            className="relative flex flex-col h-full rounded-lg overflow-hidden"
          >
            <div className={`${color} px-3 py-1 text-sm font-medium text-center`}>
              {name}
            </div>
            <div className="relative flex-grow p-4 bg-white dark:bg-gray-800">
              {/* Image Container with Tiled Background */}
              <div className="relative w-full pt-[100%] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                {/* Tiled Background Pattern */}
                <div 
                  className="absolute inset-0 opacity-30 dark:opacity-25 mix-blend-multiply dark:mix-blend-screen"
                  style={{
                    backgroundImage: 'url("/images/bg-dark.webp")',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '80px',  
                    transform: 'rotate(0deg) scale(1.2)',  
                  }}
                />
                
                {/* Main Image with Drop Shadow */}
                <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-lg p-2">
                  <div className="relative w-full h-full rounded-lg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] dark:hover:shadow-[0_8px_40px_rgba(255,255,255,0.12)]">
                    <Image
                      src={`/images/poems/${poem.slug}-${llmType}.webp`}
                      alt={`AI interpretation of ${poem.title} by ${name}`}
                      fill
                      className={`object-cover transition-all duration-500 ${
                        isChanging ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="font-medium">Analysis:</h3>
                <p className="text-sm">{analysis.analysis.image_prompt}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
