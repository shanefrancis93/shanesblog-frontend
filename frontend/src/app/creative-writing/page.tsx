"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import { Clipboard, Check } from "lucide-react";
import { type Poem, fetchPoems } from "../../data/poems";
import { PoemIllustration } from "./PoemIllustration";
import { PoemNavigation } from "./PoemNavigation";
import { AIAnalysisOverlay } from "./AIAnalysisOverlay";

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

  const handlePoemChange = (newIndex: number) => {
    setIsChanging(true);
    setTimeout(() => {
      setCurrentPoemIndex(newIndex);
      if (!autoExpand) setIsExpanded(false);
      setIsChanging(false);
    }, 300);
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-light-primary dark:border-theme-dark-primary" />
        </div>
      );
    }

    if (!currentPoem) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p>No poems available</p>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto py-16">
        <h1 className="font-serif text-4xl mb-6 text-theme-light-primary dark:text-theme-dark-primary tracking-tight">
          Creative Writing
          <div
            className="h-1 w-24 bg-gradient-to-r from-[#3d2952] to-[#2c4027] 
            dark:from-theme-dark-primary dark:to-theme-dark-secondary mt-4 rounded-full"
          />
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-3xl leading-relaxed">
          As large language models expand their understanding of subtext, the
          relationship between AI and poetry becomes especially fascinating.
          This collection serves as an experiment in how LLMs understand and
          annotate poetry, presented alongside my own reflections on work I've
          written since 2018. Each poem includes notes exploring both the human
          and machine perspectives on the text.
        </p>

        {/* Add the navigation pane */}
        <PoemNavigation
          poems={poems}
          currentIndex={currentPoemIndex}
          onPoemChange={handlePoemChange}
          autoExpand={autoExpand}
          onAutoExpandChange={setAutoExpand}
          onShowAIAnalysis={() => setShowAIAnalysis(true)}
        />

        {/* Book Container */}
        <div
          className={`flex bg-cream dark:bg-[#112240] rounded-lg shadow-2xl 
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
                  {currentPoem.title}
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
                {currentPoem.content}
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
            {currentPoem && (
              <div className="absolute inset-0 p-8">
                <PoemIllustration poem={currentPoem} isChanging={isChanging} />
                {showAIAnalysis && (
                  <AIAnalysisOverlay
                    analysis={currentPoem.analysis}
                    onClose={() => setShowAIAnalysis(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return <Layout>{renderContent()}</Layout>;
};

export default CreativeWritingPage;
