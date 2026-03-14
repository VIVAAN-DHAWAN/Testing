import * as core from '@actions/core';
import * as github from '@actions/github';
import { parseDiff } from './diff-parser';
import { getReview } from './ai';
import { getPRDetails, getPRDiff, postReviewComments, postSummary } from './github';

async function run() {
  try {
    const token = core.getInput('github_token', { required: true });
    
    const aiProvider = core.getInput('ai_provider') || 'openai';
    const openaiApiKey = core.getInput('openai_api_key');
    const anthropicApiKey = core.getInput('anthropic_api_key');
    const openrouterApiKey = core.getInput('openrouter_api_key');
    const baseUrl = core.getInput('base_url');
    const ollamaHost = core.getInput('ollama_host') || 'http://localhost:11434';
    
    let model = core.getInput('model');
    if (!model) {
      if (aiProvider === 'openai' || aiProvider === 'openrouter') model = 'gpt-4o';
      if (aiProvider === 'anthropic') model = 'claude-sonnet-4-20250514';
      if (aiProvider === 'ollama') model = 'llama3';
    }

    const reviewLevel = core.getInput('review_level') || 'full';
    const maxFiles = parseInt(core.getInput('max_files') || '10', 10);

    const context = github.context;
    if (!context.payload.pull_request) {
      core.info('Not a PR event, skipping.');
      return;
    }

    const prNumber = context.payload.pull_request.number;
    const title = context.payload.pull_request.title;

    if (title.includes('[skip-review]')) {
      core.info('PR title contains [skip-review], skipping.');
      return;
    }

    const prDetails = await getPRDetails(token);
    const diff = await getPRDiff(token, prNumber);
    const files = parseDiff(diff).slice(0, maxFiles);

    const comments: { path: string; body: string; line: number }[] = [];
    let summaryBody = '## 🤖 AI Code Review Summary\n\n';

    for (const file of files) {
      if (!file.diff.trim()) continue;

      const review = await getReview({
        aiProvider,
        openaiApiKey,
        anthropicApiKey,
        openrouterApiKey,
        baseUrl,
        ollamaHost,
        model,
        diff: file.diff,
        reviewLevel
      });
      if (!review) continue;

      summaryBody += `### ${file.filename}\n${review.summary}\n\n`;

      if (review.issues && review.issues.length > 0) {
        summaryBody += '| Line | Severity | Issue | Suggestion |\n|---|---|---|---|\n';
        for (const issue of review.issues) {
          summaryBody += `| ${issue.line} | ${issue.severity} | ${issue.message} | ${issue.suggestion} |\n`;
          comments.push({
            path: file.filename,
            body: `**${issue.severity.toUpperCase()}**: ${issue.message}\n\n*Suggestion*: ${issue.suggestion}`,
            line: issue.line > 0 ? issue.line : 1
          });
        }
        summaryBody += '\n';
      }
    }

    await postReviewComments(token, prNumber, prDetails.head.sha, comments);
    await postSummary(token, prNumber, summaryBody);

  } catch (error: any) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();
