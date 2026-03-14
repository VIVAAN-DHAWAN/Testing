import OpenAI from 'openai';

export interface ReviewIssue {
  line: number;
  severity: 'critical' | 'warning' | 'suggestion';
  message: string;
  suggestion: string;
}

export interface ReviewResult {
  summary: string;
  issues: ReviewIssue[];
}

export async function getReview(
  apiKey: string,
  baseUrl: string | undefined,
  model: string,
  diff: string,
  reviewLevel: string
): Promise<ReviewResult | null> {
  try {
    const client = new OpenAI({
      apiKey,
      baseURL: baseUrl,
    });

    const systemPrompt = `You are an expert code reviewer. Review the following code diff and identify:
1. Bugs or logic errors
2. Security vulnerabilities
3. Performance issues
4. Code style / best practices
5. Suggestions for improvement

Be concise. For each issue, specify the line number, severity (critical/warning/suggestion), and a fix.
Return structured JSON matching this schema:
{
  "summary": "Overall review summary",
  "issues": [
    {
      "line": 42,
      "severity": "critical",
      "message": "SQL injection vulnerability",
      "suggestion": "Use parameterized queries"
    }
  ]
}`;

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Review level: ${reviewLevel}\n\nDiff:\n${diff}` }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message?.content;
    if (!content) return null;
    return JSON.parse(content) as ReviewResult;
  } catch (error) {
    console.error("AI API Error:", error);
    return null;
  }
}
