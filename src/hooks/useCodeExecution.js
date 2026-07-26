import { useState } from 'react';
import { executeCode, generateSharingLink } from '../services/api/editor.api';
import {showAlert} from '../utils/alert';

export const useCodeExecution = () => {
    const [output, setOutput] = useState("");
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isShareLoading, setIsShareLoading] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [shareableLink, setShareableLink] = useState("");
    const [abortController, setAbortController] = useState(null);

    const handleRunCode = async (code, selectedLanguage) => {
        if (isLoading) {
            // Stop execution
            if (abortController) {
                abortController.abort();
                setIsLoading(false);
            }
        } else {
            // Start execution
            const controller = new AbortController();
            setAbortController(controller);
            setIsLoading(true);
            setOutput("Running...");

            try {
                const result = await executeCode(selectedLanguage, code, input, controller.signal);
                if (result.success) {
                    setOutput(
                        result.output + (result.error ? `\nErrors:\n${result.error}` : "")
                    );
                } else {
                    setOutput(
                        `Execution Error:\n${result.error || "Unknown error occurred"}`
                    );
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    setOutput('Execution stopped by user');
                } else {
                    setOutput(`Error: ${error.message}`);
                }
            } finally {
                setIsLoading(false);
                setAbortController(null);
            }
        }
    };

    const handleClearOutput = () => {
        setOutput("");
        setInput("");
    };

    const handleShare = async (code, selectedLanguage) => {
        if (!code.trim()) {
            showAlert("Hey buddy, there's no code to share! Write some code first");
            return;
        }

        setIsShareLoading(true);
        try {
            const link = await generateSharingLink(code, selectedLanguage);
            setShareableLink(link);
            setShowSharePopup(true);
        } catch (error) {
            showAlert(`Error sharing code: ${error.message}`);
        } finally {
            setIsShareLoading(false);
        }
    };

    return {
        output,
        setOutput,
        input,
        setInput,
        isLoading,
        setIsLoading,
        isShareLoading,
        showSharePopup,
        setShowSharePopup,
        shareableLink,
        handleRunCode,
        handleClearOutput,
        handleShare
    };
}; 