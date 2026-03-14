import * as github from '@actions/github';

export async function getPRDetails(token: string) {
  const octokit = github.getOctokit(token);
  const context = github.context;
  
  if (!context.payload.pull_request) {
    throw new Error('Not running in a PR context');
  }

  const { data: pr } = await octokit.rest.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.payload.pull_request.number
  });

  return pr;
}

export async function getPRDiff(token: string, pullNumber: number) {
  const octokit = github.getOctokit(token);
  const context = github.context;
  
  const { data: diff } = await octokit.rest.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pullNumber,
    mediaType: {
      format: 'diff'
    }
  });

  return diff as unknown as string;
}

export async function postReviewComments(
  token: string,
  pullNumber: number,
  commitId: string,
  comments: { path: string; body: string; line: number }[]
) {
  const octokit = github.getOctokit(token);
  const context = github.context;

  if (comments.length === 0) return;

  await octokit.rest.pulls.createReview({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pullNumber,
    commit_id: commitId,
    event: 'COMMENT',
    comments
  });
}

export async function postSummary(token: string, issueNumber: number, summary: string) {
  const octokit = github.getOctokit(token);
  const context = github.context;

  await octokit.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issueNumber,
    body: summary
  });
}
