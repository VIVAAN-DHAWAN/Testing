export interface DiffChunk {
  filename: string;
  diff: string;
}

export function parseDiff(diffString: string): DiffChunk[] {
  const files = diffString.split(/^diff --git a\//m).filter(Boolean);
  return files.map(file => {
    const lines = file.split('\n');
    const filenameMatch = lines[0].match(/.*? b\/(.*)/);
    const filename = filenameMatch ? filenameMatch[1] : 'unknown';
    
    // Extract actual diff lines without header
    const startIdx = lines.findIndex(line => line.startsWith('+++'));
    const diffContent = startIdx !== -1 ? lines.slice(startIdx + 1).join('\n') : file;

    return {
      filename,
      diff: diffContent
    };
  });
}
