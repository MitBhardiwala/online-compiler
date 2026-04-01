import { showAlert } from '../../utils/alert';

export const streamCodeToEditor = async (
  codeString,
  setIsLoading,
  setIsStreaming,
  setCode,
  originalCode = null  // Add new parameter for original code comparison
) => {
  setIsLoading(true);
  setIsStreaming(true);

  // AI Edit Mode with line comparison
  if (originalCode) {
    const originalLines = originalCode.split('\n');
    const newLines = codeString.split('\n');

    // Start with original code visible
    setCode(originalCode);
    await new Promise(resolve => setTimeout(resolve, 50));

    for (let i = 0; i < newLines.length; i++) {
      const newLine = newLines[i];
      const oldLine = originalLines[i] || '';

      // Preserve subsequent original lines until they're processed
      const preservedLines = originalLines.slice(i + 1).join('\n');

      // Animate line changes
      let currentLine = '';
      for (const char of newLine) {
        currentLine += char;
        const updatedCode = [
          ...newLines.slice(0, i),  // Already processed new lines
          currentLine,              // Current line being animated
          preservedLines            // Unprocessed original lines
        ].join('\n');
        setCode(updatedCode);
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Add slight delay between lines for visual effect
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  }
  // Regular Character Streaming Mode
  else {
    setCode("");  // Only clear for non-AI edits
    await new Promise(resolve => setTimeout(resolve, 50));

    const chars = codeString.split("");
    for (let char of chars) {
      setCode(prev => prev + char);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  setIsStreaming(false);
  setIsLoading(false);
};

export const getDefaultCode = (language, isAIMode) => {
  if (isAIMode) {
    return "ai mode is on";
  }
  return "ai mode is off";

};

// Add other utility functions as needed...
