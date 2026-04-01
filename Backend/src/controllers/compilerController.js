import LANGUAGE_CONFIG from "../config/languages.js";
import { writeTempFile, deleteTempFile } from "../utils/fileHelper.js";
import { runInDocker } from "../utils/dockerRunner.js";

/**
 * POST /execute
 * Body: { language: string, code: string, input?: string }
 */
export async function executeCode(req, res) {
  const { language, code, input = "" } = req.body;

  if (!language || !code) {
    return res.status(400).json({
      success: false,
      output: "Request must include 'language' and 'code'.",
      error: "Request must include 'language' and 'code'.",
    });
  }

  const langConfig = LANGUAGE_CONFIG[language];
  if (!langConfig) {
    return res.status(400).json({
      success: false,
      output: `Language "${language}" is not supported.`,
      error: `Language "${language}" is not supported.`,
    });
  }

  let codeFilePath;
  try {
    codeFilePath = writeTempFile(code, langConfig.filename);
  } catch (err) {
    console.error("[executeCode] writeTempFile failed:", err.message);
    return res.status(500).json({
      success: false,
      output: "Server error: could not write code file.",
      error: "Server error: could not write code file.",
    });
  }

  try {
    const result = await runInDocker(codeFilePath, langConfig, input);
    return res.json(result);
  } catch (err) {
    console.error("[executeCode] runInDocker failed:", err.message);
    return res.status(500).json({
      success: false,
      output: "Server error: execution failed.",
      error: "Server error: execution failed.",
    });
  } finally {
    deleteTempFile(codeFilePath);
  }
}