import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from '../config/config.js';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey as string);
const model = genAI.getGenerativeModel({ model: config.gemini.model });

import {
    SUPPORTED_LANGUAGES,
    MASTER_PROMPT,
    MASTER_PROMPT_FILENAME,
    CONVERSION_PROMPT,
    EDIT_PROMPT
} from '../constants/aiPrompts.js';

async function generateCode(req: Request, res: Response): Promise<void> {
    try {
        const { prompt, language } = req.body;

        if (!prompt || !language) {
            res.status(400).json({
                success: false,
                error: 'Prompt and language are required'
            });
            return;
        }

        if (!SUPPORTED_LANGUAGES.includes(language)) {
            res.status(400).json({
                success: false,
                error: 'Unsupported programming language'
            });
            return;
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

async function generateFileName(req: Request, res: Response): Promise<void> {
    try {
        const { code, language } = req.body;

        if (!code || !language) {
            res.status(400).json({
                success: false,
                error: 'Code and language are required'
            });
            return;
        }

        if (!SUPPORTED_LANGUAGES.includes(language)) {
            res.status(400).json({
                success: false,
                error: 'Unsupported programming language'
            });
            return;
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

async function convertCode(req: Request, res: Response): Promise<void> {
    try {
        const { code, sourceLanguage, targetLanguage } = req.body;

        if (!code || !sourceLanguage || !targetLanguage) {
            res.status(400).json({
                success: false,
                error: 'Code, source language and target language are required'
            });
            return;
        }

        if (!SUPPORTED_LANGUAGES.includes(sourceLanguage) || !SUPPORTED_LANGUAGES.includes(targetLanguage)) {
            res.status(400).json({
                success: false,
                error: 'Unsupported programming language'
            });
            return;
        }

        const fullPrompt = `${CONVERSION_PROMPT}${code}\n\nSource Language: ${sourceLanguage}\nTarget Language: ${targetLanguage}`;

        const result = await model.generateContent(fullPrompt);
        let response = result.response.text();

        // Clean the response by removing markdown code block syntax
        response = response.replace(/```[\w-]*\n/g, ''); // Remove opening ```language
        response = response.replace(/```\n?/g, ''); // Remove closing ```
        response = response.trim(); // Remove any extra whitespace

        if (response === 'CONVERSION_NOT_SUPPORTED') {
            res.status(400).json({
                success: false,
                error: 'Conversion between these languages is not supported'
            });
            return;
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

async function editCode(req: Request, res: Response): Promise<void> {
    try {
        const { fullCode, selectedCode, editSuggestion, language } = req.body;

        if (!fullCode || !selectedCode || !editSuggestion || !language) {
            res.status(400).json({
                success: false,
                error: 'Full code, selected code, edit suggestion and language are required'
            });
            return;
        }

        if (!SUPPORTED_LANGUAGES.includes(language)) {
            res.status(400).json({
                success: false,
                error: 'Unsupported programming language'
            });
            return;
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
            res.status(400).json({
                success: false,
                error: 'Unable to perform the requested edit'
            });
            return;
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
