import BlogPost from '@/components/BlogPost';

const content = `
  <p>In a groundbreaking study released this week, OpenAI researchers have demonstrated significant advances in applying large language models to health policy research...</p>

  <h2>Key Findings</h2>
  <p>The research team identified several critical areas where AI could enhance health policy analysis:</p>
  <ul>
    <li>Rapid literature review and synthesis</li>
    <li>Policy impact prediction modeling</li>
    <li>Stakeholder feedback analysis</li>
  </ul>

  <h2>Methodology</h2>
  <p>The study employed a novel approach combining...</p>
`;

export default function OpenAIHealthPost() {
  return (
    <BlogPost
      title="Reviewing OpenAI's Deep Research on Health Policy Research"
      date="2024-02-15"
      content={content}
      readingTime="8"
      tags={['AI', 'Healthcare', 'Policy', 'Research']}
    />
  );
} 