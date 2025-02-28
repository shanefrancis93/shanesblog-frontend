'use client';
import { useState } from 'react';
import React from 'react';

// Sample content with annotations
const content = {
  original: `
    In a groundbreaking development, OpenAI's Deep Research tool demonstrates significant potential 
    for transforming health policy analysis. The system's ability to process vast amounts of 
    research data and synthesize findings represents a major step forward in evidence-based 
    policymaking.
    
    The tool's primary strengths lie in its rapid literature review capabilities and its novel 
    approach to stakeholder feedback analysis. However, questions remain about the tool's 
    ability to handle nuanced policy contexts.
  `,
  annotated: [
    {
      text: "OpenAI's Deep Research tool demonstrates significant potential",
      annotation: "Need to clarify this is DeepSeek, not Deep Research. Common confusion point.",
      color: "yellow"
    },
    {
      text: "questions remain about the tool's ability",
      annotation: "Add specific examples of limitations found in testing",
      color: "lightblue"
    }
  ]
};

const DeepResearchReview = () => {
  const [activeTab, setActiveTab] = useState('original');
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [showAllAnnotations, setShowAllAnnotations] = useState(false);

  const renderAnnotatedContent = () => {
    let currentText = content.original;
    const annotations = content.annotated;
    let leftSide = true;
    
    return annotations.map((anno, index) => {
      const parts = currentText.split(anno.text);
      currentText = parts[1] || '';
      leftSide = !leftSide;
      
      return (
        <React.Fragment key={index}>
          {parts[0]}
          <span
            className="relative group cursor-help"
            onMouseEnter={() => !showAllAnnotations && setActiveAnnotation(anno.annotation)}
            onMouseLeave={() => !showAllAnnotations && setActiveAnnotation(null)}
          >
            <span 
              className="border-b-2 transition-colors"
              style={{ borderColor: anno.color }}
            >
              {anno.text}
            </span>
            {(activeAnnotation === anno.annotation || showAllAnnotations) && (
              <div 
                className={`
                  absolute w-64 p-2 bg-white shadow-lg rounded text-sm
                  transition-all duration-200 ease-in-out
                  ${leftSide 
                    ? 'right-full mr-4'
                    : 'left-full ml-4'
                  }
                `}
                style={{
                  top: 'var(--annotation-top, 0px)',
                  borderLeft: `4px solid ${anno.color}`,
                  borderRadius: '0 4px 4px 0',
                  boxShadow: `0 2px 10px rgba(0,0,0,0.1), 
                              ${anno.color}33 0 0 0 2px`
                }}
              >
                {anno.annotation}
              </div>
            )}
          </span>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8 border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'original' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('original')}
        >
          Original
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'annotated' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('annotated')}
        >
          Annotated
        </button>
      </div>

      {/* Document Viewer */}
      <div className="bg-white shadow-lg rounded-lg">
        {/* Word-like toolbar */}
        <div className="border-b px-4 py-2 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500">Deep Research Review</span>
          
          {/* Only show toggle in annotated view */}
          {activeTab === 'annotated' && (
            <button
              onClick={() => setShowAllAnnotations(!showAllAnnotations)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all
                ${showAllAnnotations 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
            >
              {showAllAnnotations ? 'Hide All Notes' : 'Show All Notes'}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8 min-h-[800px] bg-white prose prose-lg relative">
          {activeTab === 'original' ? (
            <div className="whitespace-pre-wrap">{content.original}</div>
          ) : (
            <div className="whitespace-pre-wrap">
              {renderAnnotatedContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeepResearchReview; 