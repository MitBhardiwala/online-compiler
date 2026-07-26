import { useState } from 'react';
import { generateAICode, editCodeWithAI } from '../services/api/editor.api';
import { streamCodeToEditor } from '../pages/Editor/editorUtils';
import { showAlert } from '../utils/alert';

export const useAIFeatures = (setCode, setIsLoading, setIsStreaming, selectedLanguage) => {
    const [isAIMode, setIsAIMode] = useState(false);
    const [bgmodePrompt, setBgmodePrompt] = useState("");
    const [isAILoading, setIsAILoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAISubmit = async () => {
        if (!bgmodePrompt.trim()) {
            showAlert("Hey buddy, there is no prompt entered!", "error");
            return;
        }
        setIsLoading(true);
        setIsAILoading(true);




        try {
            const result = await generateAICode(bgmodePrompt, selectedLanguage);

            setIsAIMode(false);
            setBgmodePrompt("");
            await streamCodeToEditor(
                result.code,
                setIsLoading,
                setIsStreaming,
                setCode
            );
        } catch (error) {
            console.error("AI generation failed:", error);
        } finally {
            setIsLoading(false);
            setIsAILoading(false);
        }
    };

    const handleAIEdit = async (fullCode, selectedCode, editSuggestion, language) => {
        setIsLoading(true);


        try {
            const response = await editCodeWithAI({
                fullCode,
                selectedCode,
                editSuggestion,
                language,
            });

            if (!response?.code) {
                throw new Error("Invalid response format from API");
            }

            await streamCodeToEditor(
                response.code,
                setIsLoading,
                setIsStreaming,
                setCode,
                fullCode
            );
        } catch (error) {
            console.error("AI edit failed:", error);
        } finally {
            setIsLoading(false);

        }
    };

    return {
        isAIMode,
        setIsAIMode,
        bgmodePrompt,
        setBgmodePrompt,
        isAILoading,
        isProcessing,
        handleAISubmit,
        handleAIEdit,
        setIsProcessing,
    };
};