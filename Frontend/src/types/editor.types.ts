export interface EditorState {
  code: string;
  language: string;
  output: string;
  isRunning: boolean;
  error: string | null;
}

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
}

export type SupportedLanguage = 
  | 'python'
  | 'javascript'
  | 'cpp'
  | 'c'
  | 'go'
  | 'php'; 