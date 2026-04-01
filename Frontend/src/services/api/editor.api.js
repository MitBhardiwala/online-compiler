const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const checkHealth = async () => {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    return data.status === "OK";
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
};

export const executeCode = async (language, code, input = "", signal) => {
  try {
    const response = await fetch(`${BASE_URL}/api/compiler/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        code,
        input,
      }),
      signal // Add the signal to the fetch request options
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Check if the error is due to abort
    if (error.name === 'AbortError') {
      throw error; // Rethrow abort error to be handled by caller
    }
    throw new Error("Code execution failed: " + error.message);
  }
};

export const generateSharingLink = async (code, language) => {
  const response = await fetch(`${BASE_URL}/api/share/generate-sharing-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language }),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error("Failed to generate sharing link");
  }
  return `online-compiler.mitbh.in/share/${data.shareLink}`;
};

export const generateAICode = async (prompt, language) => {
  const response = await fetch(`${BASE_URL}/api/ai/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      language,
    }),
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error("Failed to generate code");
  }
  return result;
};

export const getDownloadFileName = async (code, language) => {
  try {
    const response = await fetch(`${BASE_URL}/api/ai/generate-filename`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error("Failed to get filename");
    }
    return result.fileName;
  } catch (error) {
    // Fallback filename with timestamp and extension
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const extension = getFileExtension(language);
    return `occ-${timestamp}${extension}`;
  }
};

export const convertCode = async (code, sourceLanguage, targetLanguage) => {
  try {
    const response = await fetch(`${BASE_URL}/api/ai/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        sourceLanguage,
        targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error("Code conversion failed");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to convert code");
    }

    // Return just the converted code and success status
    return {
      success: true,
      code: data.code,
      language: data.targetLanguage,
    };
  } catch (error) {
    throw new Error(`Conversion error: ${error.message}`);
  }
};

export const editCodeWithAI = async ({ fullCode, selectedCode, editSuggestion, language }) => {
  const response = await fetch(`${BASE_URL}/api/ai/edit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullCode,
      selectedCode,
      editSuggestion,
      language
    }),
  });

  if (!response.ok) throw new Error('API request failed');
  
  return await response.json();
};

// Helper function to get file extension based on language
const getFileExtension = (language) => {
  const extensions = {
    javascript: ".js",
    python: ".py",
    cpp: ".cpp",
    c: ".c",
    go: ".go",
    php: ".php",
  };
  return extensions[language] || ".txt";
};
