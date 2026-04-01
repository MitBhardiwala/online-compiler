import { GoogleGenerativeAI } from "@google/generative-ai";
import config from '../config/config.js';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: config.gemini.model });

const SUPPORTED_LANGUAGES = [
    'python', 'c', 'cpp', 'java', 'csharp',
    'r', 'go', 'javascript', 'php',
    'swift', 'rust'
];

const MASTER_PROMPT = `You are a code generator for onlinecodechalao.in. 
CRITICAL INSTRUCTIONS:
- ONLY output clean, working code without any explanations or text
- ONLY respond if the request is for: ${SUPPORTED_LANGUAGES.join(', ')}
- If the request is not for code generation or uses unsupported language, respond with "INVALID_REQUEST"
- Include necessary imports/packages
- Add minimal but essential code comments
- Do not include any explanatory text before or after the code
- Format code properly with correct indentation

Request: `;

const MASTER_PROMPT_FILENAME = `You are a file name generator.
CRITICAL INSTRUCTIONS:
- ONLY output a single descriptive filename (without path or extension)
- Use lowercase with underscores for spaces
- Keep it concise but meaningful
- Base it on the code's main purpose/functionality
- Do not include any explanations
- Maximum length: 50 characters

Code: `;

const CONVERSION_PROMPT = `You are a code converter.
CRITICAL INSTRUCTIONS:
- ONLY output clean, working code without any explanations or text
- Convert the provided code from source language to target language
- Maintain exact same functionality and logic
- Include necessary imports/packages
- Preserve existing code comments and add any language-specific notes
- Do not include any explanatory text before or after the code
- Format code properly with correct indentation
- If conversion is not possible, respond with "CONVERSION_NOT_SUPPORTED"

Source Code:
`;

const EDIT_PROMPT = `You are a code editor.
CRITICAL INSTRUCTIONS:
- You will receive the full code, selected code portion, and edit suggestion
- ONLY output the full code with the changes applied
- Maintain the same code style and formatting
- Keep the logic consistent with the rest of the code
- Include necessary imports if adding new functionality
- Do not include any explanations or text
- If edit is not possible, respond with "EDIT_NOT_SUPPORTED"

Full Code:
{fullCode}

Selected Code to Edit:
{selectedCode}

Edit Suggestion:
{editSuggestion}

Language: {language}`;

async function generateCode(req, res) {
    try {
        const { prompt, language } = req.body;

        if (!prompt || !language) {
            return res.status(400).json({
                success: false,
                error: 'Prompt and language are required'
            });
        }

        if (!SUPPORTED_LANGUAGES.includes(language)) {
            return res.status(400).json({
                success: false,
                error: 'Unsupported programming language'
            });
        }

        const fullPrompt = `${MASTER_PROMPT}\nTask: ${prompt}\nLanguage: ${language}`;

        const result = await model.generateContent(fullPrompt);
        let response = result.response.text();

        // Clean the response by removing markdown code block syntax
        response = response.replace(/```[\w-]*\n/g, ''); // Remove opening ```language
        response = response.replace(/```\n?/g, ''); // Remove closing ```
        response = response.trim(); // Remove any extra whitespace

        const promptTokens = result.response.usageMetadata?.promptTokenCount || 0;
        const totalTokens = result.response.usageMetadata?.totalTokenCount || 0;
        const completionTokens = result.response.usageMetadata?.candidatesTokenCount || 0;
        const cachedContentTokens = result.response.usageMetadata?.cachedContentTokenCount || 0;

        res.json({
            success: true,
            code: response,
            language,
            usage: {
                promptTokens,
                completionTokens,
                totalTokens,
                cachedContentTokens
            }
        });
    } catch (error) {
        console.error('AI generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate code'
        });
    }
}

async function generateFileName(req, res) {
    try {
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                error: 'Code and language are required'
            });
        }

        if (!SUPPORTED_LANGUAGES.includes(language)) {
            return res.status(400).json({
                success: false,
                error: 'Unsupported programming language'
            });
        }

        const fullPrompt = `${MASTER_PROMPT_FILENAME}\n${code}`;

        const result = await model.generateContent(fullPrompt);
        let fileName = result.response.text().trim();

        // Clean the filename
        fileName = fileName
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '_') // Replace invalid chars with underscore
            .replace(/_+/g, '_') // Replace multiple underscores with single
            .replace(/^_|_$/g, ''); // Remove leading/trailing underscores

        const extension = config.supportedLanguages[language].extension;
        const fullFileName = `${fileName}.${extension}`;

        res.json({
            success: true,
            fileName: fullFileName,
            language
        });
    } catch (error) {
        console.error('AI filename generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate filename'
        });
    }
}

async function convertCode(req, res) {
    try {
        const { code, sourceLanguage, targetLanguage } = req.body;

        if (!code || !sourceLanguage || !targetLanguage) {
            return res.status(400).json({
                success: false,
                error: 'Code, source language and target language are required'
            });
        }

        if (!SUPPORTED_LANGUAGES.includes(sourceLanguage) || !SUPPORTED_LANGUAGES.includes(targetLanguage)) {
            return res.status(400).json({
                success: false,
                error: 'Unsupported programming language'
            });
        }

        const fullPrompt = `${CONVERSION_PROMPT}${code}\n\nSource Language: ${sourceLanguage}\nTarget Language: ${targetLanguage}`;

        const result = await model.generateContent(fullPrompt);
        let response = result.response.text();

        // Clean the response by removing markdown code block syntax
        response = response.replace(/```[\w-]*\n/g, ''); // Remove opening ```language
        response = response.replace(/```\n?/g, ''); // Remove closing ```
        response = response.trim(); // Remove any extra whitespace

        if (response === 'CONVERSION_NOT_SUPPORTED') {
            return res.status(400).json({
                success: false,
                error: 'Conversion between these languages is not supported'
            });
        }

        const promptTokens = result.response.usageMetadata?.promptTokenCount || 0;
        const totalTokens = result.response.usageMetadata?.totalTokenCount || 0;
        const completionTokens = result.response.usageMetadata?.candidatesTokenCount || 0;
        const cachedContentTokens = result.response.usageMetadata?.cachedContentTokenCount || 0;

        res.json({
            success: true,
            code: response,
            sourceLanguage,
            targetLanguage,
            usage: {
                promptTokens,
                completionTokens,
                totalTokens,
                cachedContentTokens
            }
        });
    } catch (error) {
        console.error('AI code conversion error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to convert code'
        });
    }
}

async function editCode(req, res) {
    try {
        const { fullCode, selectedCode, editSuggestion, language } = req.body;

        if (!fullCode || !selectedCode || !editSuggestion || !language) {
            return res.status(400).json({
                success: false,
                error: 'Full code, selected code, edit suggestion and language are required'
            });
        }

        if (!SUPPORTED_LANGUAGES.includes(language)) {
            return res.status(400).json({
                success: false,
                error: 'Unsupported programming language'
            });
        }

        const fullPrompt = EDIT_PROMPT
            .replace('{fullCode}', fullCode)
            .replace('{selectedCode}', selectedCode)
            .replace('{editSuggestion}', editSuggestion)
            .replace('{language}', language);

        const result = await model.generateContent(fullPrompt);
        let editedPortion = result.response.text();

        // Clean the response
        editedPortion = editedPortion.replace(/```[\w-]*\n/g, '');
        editedPortion = editedPortion.replace(/```\n?/g, '');
        editedPortion = editedPortion.trim();

        if (editedPortion === 'EDIT_NOT_SUPPORTED') {
            return res.status(400).json({
                success: false,
                error: 'Unable to perform the requested edit'
            });
        }

        // Replace the selected portion in the full code
        const updatedCode = fullCode.replace(selectedCode, editedPortion);

        const promptTokens = result.response.usageMetadata?.promptTokenCount || 0;
        const totalTokens = result.response.usageMetadata?.totalTokenCount || 0;
        const completionTokens = result.response.usageMetadata?.candidatesTokenCount || 0;
        const cachedContentTokens = result.response.usageMetadata?.cachedContentTokenCount || 0;

        res.json({
            success: true,
            code: updatedCode,
            language,
            usage: {
                promptTokens,
                completionTokens,
                totalTokens,
                cachedContentTokens
            }
        });
    } catch (error) {
        console.error('AI code editing error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to edit code'
        });
    }
}

export {
    generateCode,
    generateFileName,
    convertCode,
    editCode
}; 