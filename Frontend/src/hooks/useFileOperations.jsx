import { useState } from "react";
import { getDownloadFileName, convertCode } from "../services/api/editor.api";
import { streamCodeToEditor } from "../pages/Editor/editorUtils";
import { languageOptions } from "../constants/languageOptions";
import { showAlert } from "../utils/alert";
import LanguageSelectionModal, {
  setShowLanguageModal,
} from "../components/common/langaugeSelectorModal";

export const useFileOperations = (
  setCode,
  setIsLoading,
  setIsStreaming,
  setSelectedLanguage
) => {
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [isImportLoading, setIsImportLoading] = useState(false);
  const [isConvertLoading, setIsConvertLoading] = useState(false);
  const [unSupportedFileContent, setUnsupportedFileContent] = useState(null);

  // Helper function to safely update the selected language
  // In LanguageEditor, setSelectedLanguage could be a language string, not a function
  const updateLanguage = (language) => {
    if (typeof setSelectedLanguage === "function") {
      setSelectedLanguage(language);
    } else {
      // In LanguageEditor, we need to redirect to the new language editor
      window.location.href = `/${language}`;
    }
  };

  const handleDownload = async (code, selectedLanguage) => {
    if (!code.trim()) {
      showAlert(
        "Hey buddy, there's no code to download! Write some code first",
        "error"
      );
      return;
    }

    setIsDownloadLoading(true);
    try {
      const filename = await getDownloadFileName(code, selectedLanguage);
      const blob = new Blob([code], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const handleFileUpload = async (
    content,
    language,
    currentLanguage,
    isLanguageEditor = false,
    navigate
  ) => {
    if (isLanguageEditor) {
      // Language Editor specific logic
      setIsImportLoading(true);
      try {
        const supportedLanguages = languageOptions.map((lang) => lang.id);

        if (supportedLanguages.includes(language)) {
          // Language is supported, but may differ from current
          if (language !== currentLanguage) {
            // Ask user if they want to switch to detected language
            const shouldSwitch = window.confirm(
              `You've uploaded a ${language} file, but you're in the ${currentLanguage} editor. Would you like to switch to the ${language} editor?`
            );

            if (shouldSwitch) {
              // Redirect to the new language editor with the uploaded code
              navigate("/editor", {
                state: {
                  initialLanguage: language,
                  initialCode: content,
                },
                replace: true,
              });
            }
          } else {
            setCode(content);
          }
        } else {
          // Language not supported

          // Alert user that file language is not supported but can be converted
          showAlert(
            `The file you've uploaded is not supported by our compiler, but it can be converted to one of our supported languages.`,
            "info"
          );

          // Open the language selection modal

          setShowLanguageModal(true);
          setUnsupportedFileContent(content);
          
        }
      } catch (error) {
        console.error("Error importing code:", error);
        showAlert("Failed to import file", "error");
      } finally {
        setIsImportLoading(false);
      }
    } else {
      // Original behavior for Editor.jsx
      setIsImportLoading(true);
      try {
        if (language) {
          if (language === currentLanguage) {
            setCode(content);
          } else {
            setCode("");
            updateLanguage(language);
            setCode(content);
          }
        } 
      } catch (error) {
        console.error("Error importing code:", error);
        
      } finally {
        setIsImportLoading(false);
      }
    }
  };

  const handleConvert = async (
    code,
    sourceLanguage,
    targetLanguage,
    isLanguageEditor = false,
    navigate
  ) => {
    let codeToConvert = code;
    let sourceCodeLanguage = sourceLanguage;
    

    // Input validation
    if (!codeToConvert.trim()) {
      showAlert(
        "Hey buddy, there's no code to convert! Write some code first",
        "error"
      );
      return;
    }

    // Set loading states
    setIsLoading(true);
    setIsConvertLoading(true);

    try {
      const result = await convertCode(
        codeToConvert,
        sourceCodeLanguage,
        targetLanguage
      );

      if (result.success) {
        if (!isLanguageEditor) {
          // Editor.jsx path
          updateLanguage(result.language);
          await streamCodeToEditor(
            result.code,
            setIsLoading,
            setIsStreaming,
            setCode
          );
        } else {
          // LanguageEditor.jsx path
          if (navigate) {
            navigate("/editor", {
              state: {
                initialLanguage: result.language,
                shouldStream: true,
                initialCode: result.code,
              },
              replace: true,
            });
          } else {
            // If navigating isn't possible, just redirect to the new language editor
            window.location.href = `/${result.language}`;
          }
        }

        showAlert(
          `Code successfully converted to ${result.language}!`,
          "success"
        );
      } else {
        throw new Error("Code conversion failed");
      }
    } catch (error) {
      console.error("Conversion failed:", error);
      showAlert(`Conversion failed: ${error.message}`, "error");
    } finally {
      // Reset loading states
      setIsLoading(false);
      setIsConvertLoading(false);
    }
  };

  return {
    isDownloadLoading,
    isImportLoading,
    isConvertLoading,
    unSupportedFileContent,
    handleDownload,
    handleFileUpload,
    handleConvert,
  };
};
