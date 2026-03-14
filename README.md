<div align="center">
  <h1>🤖 AI Code Reviewer</h1>
  <p><strong>An automated, AI-powered code review GitHub Action that works with any OpenAI-compatible API.</strong></p>
  <img src="https://img.shields.io/badge/OpenAI-Compatible-blue" alt="OpenAI Compatible">
  <img src="https://img.shields.io/github/stars/VIVAAN-DHAWAN/Testing" alt="GitHub Stars">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/GitHub-Action-blue" alt="GitHub Actions">
</div>

## 💡 Why AI Code Reviewer?
Stop context-switching between GitHub and ChatGPT. This Action automatically reviews every PR the moment it's opened — catching bugs, security issues, and bad practices **directly on the changed lines**, for your whole team, 24/7.

## 🚀 Features
- **Auto-Review PRs:** Automatically reviews pull requests on `opened` and `synchronize`.
- **Inline Comments:** Posts targeted inline comments directly on the changed lines.
- **Summary Report:** Adds a comprehensive markdown table summary of all issues.
- **Bring Your Own API:** Works with OpenAI, Anthropic, OpenRouter, Ollama, or any compatible endpoint.
- **Fully Local Option:** Use Ollama for 100% free, private reviews with no data leaving your machine.
- **Skip Review:** Add `[skip-review]` to your PR title to bypass.

## 📦 Setup in 3 Steps

1. **Add the Action to your workflow**
2. **Add your API Key to GitHub Secrets** (`OPENAI_API_KEY`)
3. **Open a Pull Request!**

## 🛠️ Example Workflow

Create `.github/workflows/ai-review.yml`:

```yaml
name: AI Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: VIVAAN-DHAWAN/ai-code-reviewer@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}
          model: gpt-4o
          review_level: full
```

## ⚙️ Configuration Options

| Input | Description | Default | Required |
| --- | --- | --- | --- |
| `github_token` | `${{ secrets.GITHUB_TOKEN }}` | N/A | **Yes** |
| `ai_provider` | `openai`, `ollama`, `openrouter`, or `anthropic` | `openai` | No |
| `openai_api_key` | OpenAI API key | N/A | No |
| `anthropic_api_key` | Anthropic API key | N/A | No |
| `openrouter_api_key` | OpenRouter API key | N/A | No |
| `base_url` | Custom API Base URL | N/A | No |
| `ollama_host` | Custom Ollama host URL | `http://localhost:11434` | No |
| `model` | AI Model to use | Varies by provider | No |
| `review_level` | `light` or `full` | `full` | No |
| `max_files` | Maximum files to review | `10` | No |

## 🔌 Provider Examples

### OpenAI
```yaml
      - uses: VIVAAN-DHAWAN/ai-code-reviewer@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          ai_provider: openai
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}
          model: gpt-4o
```

### Anthropic Claude
```yaml
      - uses: VIVAAN-DHAWAN/ai-code-reviewer@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          ai_provider: anthropic
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          model: claude-sonnet-4-6
```

### OpenRouter (supports 200+ models)
```yaml
      - uses: VIVAAN-DHAWAN/ai-code-reviewer@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          ai_provider: openrouter
          openrouter_api_key: ${{ secrets.OPENROUTER_API_KEY }}
          model: google/gemini-2.5-flash
```

### Ollama (fully local, no API key)
```yaml
      - uses: VIVAAN-DHAWAN/ai-code-reviewer@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          ai_provider: ollama
          ollama_host: http://YOUR_MACHINE_IP:11434
          model: llama3.2
```

## 🧠 Recommended Models

| Provider | Model | Cost | Best For |
| --- | --- | --- | --- |
| OpenAI | `gpt-4o` | ~$0.01/PR | Best overall quality |
| Anthropic | `claude-sonnet-4-6` | ~$0.01/PR | Best code understanding |
| OpenRouter | `google/gemini-2.5-flash` | ~$0.001/PR | Best value |
| OpenRouter | `meta-llama/llama-3.3-70b` | Free tier | Free cloud option |
| Ollama | `llama3.2` | Free | 100% local & private |

## 🤝 Contributing
Contributions, issues and feature requests are welcome! Feel free to open a PR or issue.

## 📄 License
MIT © [VIVAAN-DHAWAN](https://github.com/VIVAAN-DHAWAN)