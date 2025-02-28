"use client";

import React, { useEffect, useState } from 'react';

// Helper function to generate random pastel colors
const generatePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsla(${hue}, 70%, 85%, 0.2)`;
};

// Simple function to analyze image color using canvas
const getAverageColor = async (imageSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const width = img.width || 1;
      const height = img.height || 1;
      
      // Sample from the top portion of the image where main subject often is
      const sampleHeight = Math.min(height, Math.floor(height * 0.4));
      
      canvas.width = width;
      canvas.height = sampleHeight;
      
      context?.drawImage(img, 0, 0);
      
      try {
        const imageData = context?.getImageData(0, 0, width, sampleHeight);
        if (!imageData) {
          resolve(generatePastelColor());
          return;
        }
        const data = imageData.data;
        
        let r = 0, g = 0, b = 0;
        let count = 0;
        
        // Sample pixels at intervals for better performance
        for (let i = 0; i < data.length; i += 20) {
          // Skip very dark or very light pixels
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness < 20 || brightness > 235) continue;
          
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        
        if (count === 0) {
          resolve(generatePastelColor());
          return;
        }
        
        // Calculate averages and create a softer color
        r = Math.min(255, Math.floor((r / count) * 1.2));
        g = Math.min(255, Math.floor((g / count) * 1.2));
        b = Math.min(255, Math.floor((b / count) * 1.2));
        
        // Increase saturation slightly
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        if (diff > 0) {
          const saturationBoost = 1.3;
          r = Math.min(255, Math.max(0, r + (r - ((r + g + b) / 3)) * saturationBoost));
          g = Math.min(255, Math.max(0, g + (g - ((r + g + b) / 3)) * saturationBoost));
          b = Math.min(255, Math.max(0, b + (b - ((r + g + b) / 3)) * saturationBoost));
        }
        
        resolve(`rgba(${r}, ${g}, ${b}, 0.1)`);
      } catch (error) {
        console.error('Error analyzing image:', error);
        resolve(generatePastelColor());
      }
    };
    
    img.onerror = () => {
      console.error('Error loading image');
      resolve(generatePastelColor());
    };
  });
};

interface DynamicImageBackgroundProps {
  imageSrc: string;
  children: React.ReactNode;
}

export const DynamicImageBackground: React.FC<DynamicImageBackgroundProps> = ({
  imageSrc,
  children
}) => {
  const [backgroundColor, setBackgroundColor] = useState(generatePastelColor());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const analyzeImage = async () => {
      setIsLoading(true);
      try {
        if (imageSrc) {
          const color = await getAverageColor(imageSrc);
          setBackgroundColor(color);
        } else {
          setBackgroundColor(generatePastelColor());
        }
      } catch (error) {
        console.error('Failed to analyze image:', error);
        setBackgroundColor(generatePastelColor());
      }
      setIsLoading(false);
    };

    analyzeImage();
  }, [imageSrc]);

  return (
    <div 
      className="relative w-full min-h-[500px] md:min-h-[600px] transition-all duration-700 ease-in-out"
      style={{ 
        backgroundColor,
      }}
    >
      {/* Background Pattern Layer - Full Container */}
      <div className="absolute inset-0 z-0">
        {/* Light Theme Pattern */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none dark:opacity-0 transition-opacity duration-300 backdrop-blur-[1px]"
          style={{
            backgroundImage: 'url("/images/bg-light.webp")',
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
            transform: 'rotate(0deg)',
          }}
        />
        
        {/* Dark Theme Pattern */}
        <div 
          className="absolute inset-0 opacity-0 dark:opacity-25 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: 'url("/images/bg-dark.webp")',
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
            transform: 'rotate(0deg)',
          }}
        />
      </div>

      {/* Dynamic Color Overlay */}
      <div 
        className="absolute inset-0 z-0"
      />
      
      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
