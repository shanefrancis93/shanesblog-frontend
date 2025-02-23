import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const RESPONSES_DIR = path.join(process.cwd(), 'data', 'quiz-responses');

interface QuizResponse {
  questionId: string;
  response: string;
  confidence: number;
}

interface QuizSubmission {
  postSlug: string;
  responses: QuizResponse[];
  timestamp?: string;
}

export async function POST(request: Request) {
  try {
    const body: QuizSubmission = await request.json();
    
    // Ensure responses directory exists
    await fs.mkdir(RESPONSES_DIR, { recursive: true });
    
    // Add timestamp to submission
    const submission: QuizSubmission = {
      ...body,
      timestamp: new Date().toISOString()
    };
    
    // Save response to file
    const responsePath = path.join(RESPONSES_DIR, `${body.postSlug}.json`);
    
    // Read existing responses or create new array
    let responses: QuizSubmission[] = [];
    try {
      const existing = await fs.readFile(responsePath, 'utf-8');
      responses = JSON.parse(existing);
    } catch (error) {
      // File doesn't exist yet, start with empty array
    }
    
    // Add new submission
    responses.push(submission);
    
    // Write back to file
    await fs.writeFile(responsePath, JSON.stringify(responses, null, 2));
    
    // Calculate and return aggregated results
    const aggregatedResults = responses.reduce((acc, curr) => {
      curr.responses.forEach(response => {
        if (!acc[response.questionId]) {
          acc[response.questionId] = {};
        }
        if (!acc[response.questionId][response.response]) {
          acc[response.questionId][response.response] = 0;
        }
        acc[response.questionId][response.response]++;
      });
      return acc;
    }, {} as Record<string, Record<string, number>>);
    
    return NextResponse.json({
      success: true,
      aggregatedResults
    });
  } catch (error) {
    console.error('Error saving quiz response:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz response' },
      { status: 500 }
    );
  }
}
