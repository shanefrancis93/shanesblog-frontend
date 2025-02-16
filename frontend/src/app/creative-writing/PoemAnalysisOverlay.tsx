import React, { useState, useRef } from 'react';
import { PoemAnalysis, LLMType, LLMAnalysis, Poem, LLMEntry } from '../../data/poems';
import Image from 'next/image';

interface PoemAnalysisOverlayProps {
  poem: Poem;
  onClose: () => void;
}

// Define color scheme interface
interface LLMColorScheme {
  bg: string;
  text: string;
  border: string;
}

const PoemAnalysisOverlay: React.FC<PoemAnalysisOverlayProps> = ({ poem, onClose }) => {
  const [activeView, setActiveView] = useState<keyof PoemAnalysis>('favorite_lines');
  
  // Handle click outside
  const overlayContentRef = useRef<HTMLDivElement>(null);
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!poem.llm_analysis) {
    return (
      <div className="text-center py-4 text-gray-500">No analysis available</div>
    );
  }

  // Define color schemes with proper typing
  const llmColorSchemes: Record<LLMType, LLMColorScheme> = {
    claude: {
      bg: 'bg-purple-100',
      text: 'text-purple-900',
      border: 'border-purple-300'
    },
    gpt: {
      bg: 'bg-green-100',
      text: 'text-green-900',
      border: 'border-green-300'
    },
    gemini: {
      bg: 'bg-blue-100',
      text: 'text-blue-900',
      border: 'border-blue-300'
    }
  };

  // Extract line numbers from analysis text
  const getHighlightedLines = (text: string): number[] => {
    const lineNumbers: number[] = [];
    const matches = text.match(/lines? (\d+(?:-\d+)?)/gi) || [];
    
    for (const match of matches) {
      const numbers = match.match(/\d+(?:-\d+)?/)?.[0];
      if (numbers?.includes('-')) {
        const [start, end] = numbers.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          lineNumbers.push(i);
        }
      } else if (numbers) {
        lineNumbers.push(Number(numbers));
      }
    }
    
    return Array.from(new Set(lineNumbers));
  };

  // Get active LLMs (those with analysis)
  const activeLLMs = Object.entries(poem.llm_analysis)
    .filter(([_, data]) => data.analysis && data.analysis[activeView])
    .map(([llm]) => llm as LLMType);

  // Split poem content into lines, preserving empty lines
  const poemLines = poem.content.split(/\r?\n/);

  // Get highlighted lines for each LLM
  const highlightedLinesByLLM = new Map<number, LLMType[]>();
  
  activeLLMs.forEach(llm => {
    const analysis = poem.llm_analysis?.[llm]?.analysis?.[activeView];
    if (analysis) {
      const lines = getHighlightedLines(analysis);
      lines.forEach(line => {
        const current = highlightedLinesByLLM.get(line) || [];
        highlightedLinesByLLM.set(line, [...current, llm]);
      });
    }
  });

  // Add 'artwork' to the view types
  const views = ['favorite_lines', 'interpretation', 'criticism', 'emotional_impact', 'artwork'] as const;
  type ViewType = typeof views[number];

  const viewLabels: Record<ViewType, string> = {
    favorite_lines: 'Favorite Lines',
    interpretation: 'Interpretation',
    criticism: 'Criticism',
    emotional_impact: 'Emotional Impact',
    artwork: 'AI Artwork'
  };

  const [activeViewTab, setActiveViewTab] = useState<ViewType>('interpretation');

  const AnalysisSection: React.FC<{ analysis: LLMEntry | undefined, llmName: string }> = ({ analysis, llmName }) => {
    if (!analysis?.analysis) return null;

    const { favorite_lines, interpretation, criticism, emotional_impact, image_prompt } = analysis.analysis;
    
    // Show the image section only when 'artwork' tab is active
    if (activeViewTab === 'artwork') {
      return (
        <div className="space-y-4 p-4">
          <h3 className="text-xl font-semibold capitalize">{llmName}'s Vision</h3>
          {(image_prompt || analysis.image_url) && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                {image_prompt && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <strong>Prompt:</strong> {image_prompt}
                  </p>
                )}
                {analysis.image_url && (
                  <div className="relative aspect-square w-full max-w-md mx-auto">
                    <Image
                      src={analysis.image_url}
                      alt={`AI generated artwork for poem based on ${llmName}'s interpretation`}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // For other tabs, show the corresponding analysis text
    const content = analysis.analysis[activeViewTab];
    return content ? (
      <div className="space-y-4 p-4">
        <h3 className="text-xl font-semibold capitalize">{llmName} Analysis</h3>
        <p className="whitespace-pre-line">{content}</p>
      </div>
    ) : null;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
      onClick={handleOverlayClick}
    >
      <div 
        ref={overlayContentRef}
        className="relative bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close overlay"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4 pr-8">Poem Analysis</h2>  
        
        {/* View Selection */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {views.map((view) => (
            <button
              key={view}
              onClick={() => setActiveViewTab(view)}
              className={`px-4 py-2 rounded-lg text-sm ${
                view === activeViewTab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {viewLabels[view]}
            </button>
          ))}
        </div>

        {/* Analysis Sections */}
        <div className="space-y-4">
          {Object.entries(poem.llm_analysis || {}).map(([llm]) => (
            <div
              key={llm}
              className={`rounded-lg ${llmColorSchemes[llm as LLMType].bg} ${llmColorSchemes[llm as LLMType].border} border`}
            >
              <AnalysisSection analysis={poem.llm_analysis?.[llm as LLMType]} llmName={llm} />
            </div>
          ))}
        </div>

        {/* Poem Display */}
        <div className="border rounded-lg p-4 bg-gray-50">
          {poemLines.map((line, index) => {
            const highlightingLLMs = highlightedLinesByLLM.get(index + 1) || [];
            const isHighlighted = highlightingLLMs.length > 0;

            return (
              <div 
                key={index}
                className={`py-1 flex items-center gap-2 ${
                  isHighlighted ? 'bg-gray-100' : ''
                }`}
              >
                <span className="text-gray-400 text-sm w-8">{index + 1}</span>
                <span>{line || '\u00A0'}</span>
                {isHighlighted && (
                  <div className="flex gap-1 ml-2">
                    {highlightingLLMs.map(llm => (
                      <div 
                        key={llm}
                        className={`w-3 h-3 rounded-full ${llmColorSchemes[llm].bg} ${llmColorSchemes[llm].border} border`}
                        title={`Highlighted by ${llm.toUpperCase()}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          {activeLLMs.map(llm => (
            <div key={llm} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${llmColorSchemes[llm].bg} ${llmColorSchemes[llm].border} border`} />
              <span className={`text-sm ${llmColorSchemes[llm].text} capitalize`}>{llm}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoemAnalysisOverlay;
