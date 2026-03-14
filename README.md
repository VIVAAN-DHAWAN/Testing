<div align="center">
  <h1>🤖 AI Code Reviewer</h1>
  <p><strong>An automated, AI-powered code review GitHub Action that works with any OpenAI-compatible API.</strong></p>
  <img src="https://img.shields.io/badge/OpenAI-Compatible-blue" alt="OpenAI Compatible">
</div>

## 🚀 Features
- **Auto-Review PRs:** Automatically reviews pull requests on `opened` and `synchronize`.
- **Inline Comments:** Posts targeted inline comments directly on the changed lines.
- **Summary Report:** Adds a comprehensive markdown table summary of all issues.
- **Bring Your Own API:** Works with OpenAI, OpenRouter, Groq, or any compatible endpoint.
- **Skip Review:** Add `[skip-review]` to your PR title to bypass.

## 📦 Setup in 3 Steps

1. **Add the Action to your workflow**
2. **Add your API Key to GitHub Secrets** (`OPENAI_API_KEY`)
3. **Open a Pull Request!**

## 🛠 Example Workflow

Create `.github/workflows/ai-review.yml`:

\`\`\`yaml
name: AI Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: your-username/ai-code-reviewer@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}
          model: gpt-4o
          review_level: full
\`\`\`

## ⚙️ Configuration Options

| Input | Description | Default | Required |
| --- | --- | --- | --- |
| `github_token` | `${{ secrets.GITHUB_TOKEN }}` | N/A | **Yes** |
| `openai_api_key` | Your OpenAI/OpenRouter API key | N/A | **Yes** |
| `openai_base_url` | Custom Base URL (e.g. OpenRouter) | N/A | No |
| `model` | AI Model to use | `gpt-4o` | No |
| `review_level` | `light` or `full` | `full` | No |
| `max_files` | Maximum files to review | `10` | No |

## 📸 Screenshots
*(Add a demo GIF or screenshot here showing the PR comments)*

## 🤝 Contributing
Contributions, issues and feature requests are welcome!
