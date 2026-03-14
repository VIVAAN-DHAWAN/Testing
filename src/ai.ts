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

export interface ReviewOptions {
  aiProvider: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  openrouterApiKey?: string;
  baseUrl?: string;
  ollamaHost?: string;
  model: string;
  diff: string;
  reviewLevel: string;
}

export async function getReview(opts: ReviewOptions): Promise<ReviewResult | null> {
  const { aiProvider, openaiApiKey, anthropicApiKey, openrouterApiKey, baseUrl, ollamaHost, model, diff, reviewLevel } = opts;
  
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

  const userPrompt = `Review level: ${reviewLevel}\n\nDiff:\n${diff}`;

  try {
    if (aiProvider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicApiKey || '',
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic Error: ${await response.text()}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      
      // Attempt to extract JSON from markdown if needed
      const jsonStr = content.replace(/```json\n/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr) as ReviewResult;
    } 
    
    if (aiProvider === 'ollama') {
      const response = await fetch(`${ollamaHost}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          stream: false,
          format: 'json',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama Error: ${await response.text()}`);
      }

      const data = await response.json();
      return JSON.parse(data.message.content) as ReviewResult;
    }

    // Default: OpenAI or OpenRouter
    const isOpenRouter = aiProvider === 'openrouter';
    const client = new OpenAI({
      apiKey: isOpenRouter ? openrouterApiKey : openaiApiKey,
      baseURL: isOpenRouter ? 'https://openrouter.ai/api/v1' : baseUrl,
    });

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message?.content;
    if (!content) return null;
    return JSON.parse(content) as ReviewResult;

  } catch (error) {
    console.error(`AI API Error (${aiProvider}):`, error);
    return null;
  }
}
