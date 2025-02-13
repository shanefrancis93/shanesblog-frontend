'use client';
import { useState } from 'react';

type ResumeVersion = 'engineering' | 'consulting' | 'leadership';

const ResumePage = () => {
  const [activeVersion, setActiveVersion] = useState<ResumeVersion>('engineering');
  
  const resumeVersions = {
    engineering: {
      title: 'Software Engineering',
      path: '/resumes/engineering-resume.pdf',
      highlights: [
        'Full-stack development experience',
        'AI/ML system architecture',
        'Technical project leadership'
      ]
    },
    consulting: {
      title: 'Technical Consulting',
      path: '/resumes/consulting-resume.pdf',
      highlights: [
        'Client relationship management',
        'Solution architecture',
        'Technical strategy'
      ]
    },
    leadership: {
      title: 'Technical Leadership',
      path: '/resumes/leadership-resume.pdf',
      highlights: [
        'Team management',
        'Project delivery',
        'Strategic planning'
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Version Navigation */}
      <div className="flex space-x-4 mb-8 border-b">
        {(Object.keys(resumeVersions) as ResumeVersion[]).map((version) => (
          <button
            key={version}
            className={`px-4 py-2 ${
              activeVersion === version 
                ? 'border-b-2 border-blue-500 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveVersion(version)}
          >
            {resumeVersions[version].title}
          </button>
        ))}
      </div>

      {/* Document Viewer */}
      <div className="bg-white shadow-lg rounded-lg">
        {/* Toolbar */}
        <div className="border-b px-4 py-2 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500">
            {resumeVersions[activeVersion].title} Resume
          </span>
          <button
            onClick={() => window.open(resumeVersions[activeVersion].path, '_blank')}
            className="px-4 py-1.5 rounded-full text-sm font-medium 
              bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </button>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[800px] bg-white prose prose-lg">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Key Highlights</h3>
            <ul className="list-disc pl-5">
              {resumeVersions[activeVersion].highlights.map((highlight, index) => (
                <li key={index} className="text-gray-600">{highlight}</li>
              ))}
            </ul>
          </div>
          
          <div className="border-t pt-6">
            {/* PDF Preview would go here */}
            <div className="text-center text-gray-500">
              Resume preview for {resumeVersions[activeVersion].title} role
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage; 