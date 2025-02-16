"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import { Clipboard, Check } from "lucide-react";
import { type Poem, fetchPoems } from "../../data/poems";
import { PoemIllustration } from "./PoemIllustration";
import { PoemNavigation } from "./PoemNavigation";
import PoemAnalysisOverlay from "./PoemAnalysisOverlay";

const CreativeWritingPage = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoExpand, setAutoExpand] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [shouldShowExpandButton, setShouldShowExpandButton] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentPoem = poems[currentPoemIndex];

  useEffect(() => {
    const loadPoems = async () => {
      setIsLoading(true);
      try {
        const fetchedPoems = await fetchPoems();
        console.log('Fetched poems:', fetchedPoems); // Debug log
        setPoems(fetchedPoems);
      } catch (error) {
        console.error("Error loading poems:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPoems();
  }, []);

  useEffect(() => {
    if (autoExpand && contentRef.current) {
      setIsExpanded(true);
    }
  }, [currentPoemIndex, autoExpand]);

  useEffect(() => {
    if (currentPoem) {
      console.log('Current poem:', currentPoem); // Debug log
      console.log('LLM Analysis:', currentPoem.llm_analysis); // Debug log
    }
  }, [currentPoem]);

  // Check if content needs expansion
  useEffect(() => {
    const measureContent = () => {
      const element = contentRef.current;
      if (element) {
        const hasOverflow = element.scrollHeight > 600;
        setShouldShowExpandButton(hasOverflow);
      }
    };

    // Measure after content renders
    const timer = setTimeout(measureContent, 0);
    return () => clearTimeout(timer);
  }, [currentPoem?.content]); // Only re-run when poem content changes

  const copyToClipboard = () => {
    if (!currentPoem) return;
    const textToCopy = `${currentPoem.title}\nby Shane Farrow\n\n${currentPoem.content}`;
    navigator.clipboard.writeText(textToCopy);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handlePoemChange = async (newIndex: number) => {
    if (newIndex < 0 || newIndex >= poems.length) return;
    setIsChanging(true);
    setCurrentPoemIndex(newIndex);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsChanging(false);
  };

  const nextPoem = () => {
    if (currentPoemIndex < poems.length - 1) {
      handlePoemChange(currentPoemIndex + 1);
    }
  };

  const previousPoem = () => {
    if (currentPoemIndex > 0) {
      handlePoemChange(currentPoemIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-heading mb-8">Creative Writing</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Welcome to my creative writing space. Here you'll find a collection of my poems,
          each paired with an AI-generated illustration. The AI analysis feature provides unique
          machine perspectives on the text.
        </p>

        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Left column with poem content */}
          <div className="flex-1">
            <div className="flex flex-col gap-4">
              <PoemNavigation
                poems={poems}
                currentIndex={currentPoemIndex}
                onNavigate={handlePoemChange}
                isChanging={isChanging}
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setAutoExpand(!autoExpand)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    autoExpand 
                    ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' 
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  Auto-Expand
                </button>
                <button
                  onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    showAIAnalysis 
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100' 
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  AI Analysis
                </button>
              </div>
            </div>

            {/* Book Container */}
            <div
              className={`mt-4 flex bg-cream dark:bg-[#112240] rounded-lg shadow-2xl 
              ${isExpanded ? "min-h-[800px]" : "h-[800px]"} 
              border border-gray-200 dark:border-transparent relative 
              transition-all duration-500 ease-in-out`}
            >
              {/* Left Page (Poem) */}
              <div className="flex-1 p-8 border-r border-gray-300 dark:border-gray-600 font-serif text-lg leading-relaxed relative">
                <div className="max-w-prose mx-auto h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h2
                      className={`text-2xl font-heading transition-opacity duration-300 ${
                        isChanging ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {currentPoem?.title}
                    </h2>
                    <button
                      onClick={copyToClipboard}
                      className={`p-2 rounded-full transition-colors ${
                        showCopyFeedback
                          ? "bg-green-200 dark:bg-green-800"
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      title="Copy poem to clipboard"
                    >
                      {showCopyFeedback ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span className="absolute -bottom-8 right-0 text-sm bg-gray-800 text-white px-2 py-1 rounded">
                            Poem copied
                          </span>
                        </>
                      ) : (
                        <Clipboard className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div
                    ref={contentRef}
                    className={`whitespace-pre-wrap transition-all duration-700 ease-in-out
                      ${isExpanded ? "max-h-[2000px]" : "max-h-[600px]"} 
                      ${
                        isChanging
                          ? "opacity-0 translate-y-4"
                          : "opacity-100 translate-y-0"
                      }
                      overflow-hidden`}
                  >
                    {currentPoem?.content}
                  </div>

                  {!isExpanded && shouldShowExpandButton && (
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="absolute bottom-16 left-1/2 transform -translate-x-1/2
                        bg-gray-200 dark:bg-gray-700 p-2 rounded-full
                        hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="text-lg">↓</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Page (Illustration) */}
              <div className="flex-1 relative">
                <PoemIllustration poem={currentPoem} isChanging={isChanging} />
              </div>
            </div>

            {/* AI Analysis Section */}
            {showAIAnalysis && currentPoem && (
              <PoemAnalysisOverlay 
                poem={currentPoem} 
                onClose={() => setShowAIAnalysis(false)} 
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreativeWritingPage;
