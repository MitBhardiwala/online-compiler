import { Request, Response } from 'express';
import LANGUAGE_CONFIG from "../config/languages.js";
import { writeTempFile, deleteTempFile } from "../utils/fileHelper.js";
import { runInDocker } from "../utils/dockerRunner.js";

/**
 * POST /execute
 * Body: { language: string, code: string, input?: string }
 */
export async function executeCode(req: Request, res: Response): Promise<void> {
  const { language, code, input = "" } = req.body;

  if (!language || !code) {
    res.status(400).json({
      success: false,
      output: "Request must include 'language' and 'code'.",
      error: "Request must include 'language' and 'code'.",
    });
    return;
  }

  const langConfig = LANGUAGE_CONFIG[language];
  if (!langConfig) {
    res.status(400).json({
      success: false,
      output: `Language "${language}" is not supported.`,
      error: `Language "${language}" is not supported.`,
    });
    return;
  }

  let codeFilePath: string;
  try {
    codeFilePath = writeTempFile(code, langConfig.filename);
  } catch (err) {
    console.error("[executeCode] writeTempFile failed:", (err as Error).message);
    res.status(500).json({
      success: false,
      output: "Server error: could not write code file.",
      error: "Server error: could not write code file.",
    });
    return;
  }

  try {
    const result = await runInDocker(codeFilePath, langConfig, input);
    res.json(result);
  } catch (err) {
    console.error("[executeCode] runInDocker failed:", (err as Error).message);
    res.status(500).json({
      success: false,
      output: "Server error: execution failed.",
      error: "Server error: execution failed.",
    });
  } finally {
    deleteTempFile(codeFilePath!);
  }
}
