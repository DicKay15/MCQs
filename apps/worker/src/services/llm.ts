import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import type { Env } from "../types";
import type { GeneratedQuestion, QuestionStyle, Difficulty } from "@mcqs/shared";
import { getPrompt } from "../prompts";

interface GenerateQuizParams {
  subject: string;
  theme?: string;
  difficulty: Difficulty;
  styles: QuestionStyle[];
  count: number;
  apiKey?: string;
}

export async function generateQuiz(
  env: Env,
  params: GenerateQuizParams
): Promise<GeneratedQuestion[]> {
  const { subject, theme, difficulty, styles, count, apiKey } = params;

  // Get API key from params or environment
  const geminiApiKey = apiKey || env.GOOGLE_API_KEY;

  if (!geminiApiKey) {
    throw new Error("Gemini API key is required. Please add it in Settings.");
  }

  // Distribute questions across styles
  const questionsPerStyle = Math.floor(count / styles.length);
  const remainderQuestions = count % styles.length;

  // Create distribution: each style gets base count, first styles get the remainder
  const styleDistribution: { style: QuestionStyle; count: number }[] = styles.map(
    (style, index) => ({
      style,
      count: questionsPerStyle + (index < remainderQuestions ? 1 : 0),
    })
  );

  const prompt = getPrompt({
    subject,
    theme,
    difficulty,
    styles: styleDistribution,
    totalCount: count,
  });

  const systemPrompt = `You are a UPSC Civil Services Preliminary Examination expert question generator with deep knowledge of the Indian civil services examination pattern, syllabus, and question standards.

YOUR ROLE:
- Generate questions that match the exact standard of actual UPSC Prelims questions
- Ensure 100% factual accuracy - someone's career depends on this
- Create elimination-proof questions that test genuine knowledge

UPSC EXAM CONTEXT:
- UPSC Prelims has 100 questions worth 200 marks (2 marks each)
- Negative marking: 0.66 marks deducted per wrong answer
- Cut-off typically ranges from 75-100 marks
- 56% of questions are statement-based (2-5 statements to evaluate)
- ~8 match-the-following questions per paper
- ~7-18 assertion-reason questions per paper

CRITICAL REQUIREMENTS:
1. FACTUAL ACCURACY: Every fact, date, article number, year MUST be 100% accurate. Cross-reference with NCERT, Laxmikanth, Spectrum, Ramesh Singh.
2. SINGLE CORRECT ANSWER: There must be exactly ONE definitively correct answer.
3. SMART DISTRACTORS: DO NOT use absolute words (only, always, never, all, none) in wrong options - UPSC aspirants know this pattern.
4. EDUCATIONAL EXPLANATIONS: Explain WHY correct answer is right AND why each distractor is wrong.

OUTPUT FORMAT:
Respond with ONLY a valid JSON array. No other text, no markdown, no explanations outside JSON.

Each question object must have:
{
  "questionText": "Complete question with proper formatting for statements/assertions",
  "questionType": "standard" | "statement" | "match" | "assertion",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correctOption": 0-3 (index: 0=A, 1=B, 2=C, 3=D),
  "explanation": "Detailed explanation with source references"
}

QUESTION TYPE FORMATS:
- STATEMENT: "Consider the following statements: 1. ... 2. ... 3. ... How many of the above statements is/are correct?" Options: A) Only one B) Only two C) All three D) None
- ASSERTION-REASON: "Assertion (A): ... Reason (R): ... Which is correct?" Options must be the standard 4 A-R options.
- MATCH: "Match List-I with List-II..." with proper table format and combination options like "A-1, B-2, C-3, D-4"

Generate exactly ${count} questions now.`;

  // Use Gemini
  const google = createGoogleGenerativeAI({
    apiKey: geminiApiKey,
  });

  const { text } = await generateText({
    model: google("gemini-3-flash-preview"),
    system: systemPrompt,
    prompt: prompt,
    maxTokens: Math.min(8000 + count * 300, 32000), // Increased tokens for detailed questions and explanations
  });

  // Parse the response
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const questions: GeneratedQuestion[] = JSON.parse(jsonMatch[0]);

    // Validate and normalize questions
    return questions.slice(0, count).map((q, i) => ({
      questionText: q.questionText || `Question ${i + 1}`,
      questionType: q.questionType || "standard",
      options: Array.isArray(q.options) && q.options.length === 4
        ? q.options
        : ["Option A", "Option B", "Option C", "Option D"],
      correctOption: typeof q.correctOption === "number" && q.correctOption >= 0 && q.correctOption <= 3
        ? q.correctOption
        : 0,
      explanation: q.explanation || "No explanation provided.",
      metadata: q.metadata,
    }));
  } catch (error) {
    console.error("Failed to parse LLM response:", error);
    console.error("Raw response:", text);
    throw new Error("Failed to generate valid questions. Please try again.");
  }
}
