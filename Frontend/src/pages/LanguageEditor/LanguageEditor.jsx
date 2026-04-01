import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, CTA, Footer } from "../../components";
import { CodeEditor, OutputWindow } from "../../components/editor";
import styles from "../../styles/style";
import { Button } from "../../components/common";
import { getFileExtension } from "../../services/utils/helpers";
import LoadingOverlay from "../../utils/LoadingOverlay";
import { languageContent } from "../../config/languageContent";
import { Helmet } from "react-helmet-async";
import TopBar from "../../components/editor/TopBar";
import { useCodeExecution } from "../../hooks/useCodeExecution";
import { useAIFeatures } from "../../hooks/useAIFeatures";
import { useFileOperations } from "../../hooks/useFileOperations";
import { useTextSelection } from "../../hooks/useTextSelection";
import { SelectionMenu, PromptInput } from "../../components/common";
import { showAlert } from "../../utils/alert";
import SharePopup from "../../components/common/SharePopup";

const LanguageEditor = () => {
  const { language } = useParams();
  const [code, setCode] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);


  // Initialize custom hooks
  const {
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
    handleShare,
  } = useCodeExecution();

  const {
    isAILoading,
    isProcessing,
    handleAISubmit,
    handleAIEdit,
    bgmodePrompt,
    setBgmodePrompt,
    isAIMode,
    setIsAIMode,
    setIsProcessing,
  } = useAIFeatures(setCode, setIsLoading, setIsStreaming, language);

  const {
    isDownloadLoading,
    isImportLoading,
    isConvertLoading,
    unSupportedFileContent,
    handleDownload,
    handleFileUpload,
    handleConvert,
  } = useFileOperations(setCode, setIsLoading, setIsStreaming, language);

  const {
    selectionMenu,
    showPromptInput,
    promptInput,
    setPromptInput,
    menuRef,
    promptInputRef,
    handleTextSelection,
    handleEdit,
    setShowPromptInput,
    setSelectionMenu,
    hideUIElements,
  } = useTextSelection();

  useEffect(() => {
    setOutput("");
    setInput("");
  }, [language, isAIMode]);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (isAIMode && !isLoading && !isStreaming) {
        handleAISubmit();
      } else if (!isAIMode && !isLoading) {
        console.log("helllo");
        handleRunCode(code, selectedLanguage);
      }
    }
  };

  const handleSendToAI = async () => {
    setIsLoading(true);
    setIsProcessing(true);
    hideUIElements();
    try {
      await handleAIEdit(
        code,
        selectionMenu.selectedText,
        promptInput,
        language
      );
      setSelectionMenu((prevState) => ({
        ...prevState,
        visible: false,
      }));
      setPromptInput("");
    } catch (error) {
      console.error("AI edit failed:", error);
      showAlert(`AI edit failed: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const content = languageContent[language] || {
    title: `${
      language.charAt(0).toUpperCase() + language.slice(1)
    } Online Compiler`,
    description: `Write and run your ${language} code online...`,
  };

  return (
    <div className="bg-primary w-full overflow-hidden">
      <Helmet>
        <title>{content.title}</title>
      </Helmet>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      <div className={`bg-primary ${styles.flexStart} ${styles.paddingX}`}>
        <div className={`${styles.boxWidth}`}>
          <div className="flex flex-col w-full gap-8 py-12">
            <div>
              <h1 className="text-white text-4xl font-bold mb-4">
                {content.title}
              </h1>
              <p className="text-dimWhite">{content.description}</p>
            </div>

            <Link to="/editor" className="flex justify-end">
              <Button text="Try our multi-language compiler" styles="mb-6" />
            </Link>

            <div className="h-[800px] sm:h-[600px] grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-800 rounded-lg overflow-hidden">
              <div className="flex flex-col bg-[#0F1117] overflow-hidden">
                <TopBar
                  fileName={`main.${getFileExtension(language)}`}
                  isAIMode={isAIMode}
                  setIsAIMode={setIsAIMode}
                  handleShare={() => handleShare(code, language)}
                  handleDownload={() => handleDownload(code, language)}
                  handleSubmit={
                    isAIMode
                      ? () => handleAISubmit(bgmodePrompt)
                      : () => handleRunCode(code, language)
                  }
                  handleConvert={handleConvert}
                  isLoading={isLoading}
                  isShareLoading={isShareLoading}
                  isDownloadLoading={isDownloadLoading}
                  isStreaming={isStreaming}
                  currentLanguage={language}
                  handleFileUpload={handleFileUpload}
                  setBgmodePrompt={setBgmodePrompt}
                  code={code}
                  isLanguageEditor={true}
                  setOutput={setOutput}
                  unSupportedFileContent={unSupportedFileContent}
                />

                <div className="flex-1 overflow-hidden min-h-0">
                  {isAIMode ? (
                    <textarea
                      value={bgmodePrompt}
                      onChange={(e) => setBgmodePrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full h-full bg-[#1E1E1E] text-white p-4 resize-none focus:outline-none font-mono overflow-auto"
                      placeholder="Enter your AI prompt here... (Press Ctrl+Enter or Cmd+Enter to submit)"
                    />
                  ) : (
                    <CodeEditor
                      code={code}
                      setCode={setCode}
                      language={language}
                      onSelection={handleTextSelection}
                      onKeyDown={handleKeyDown}
                    />
                  )}
                </div>
              </div>
              <OutputWindow
                output={output}
                onClear={handleClearOutput}
                input={input}
                setInput={setInput}
                code={code}
                onDebug={({ error, code }) => {
                  setIsAIMode(true);
                  setTimeout(() => {
                    const debugPrompt = `CODE:\n${code}\n\nERROR:\n${error}`;
                    setBgmodePrompt(debugPrompt);
                  }, 0);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
        </div>
      </div>

      <SharePopup
          isOpen={showSharePopup}
          onClose={() => setShowSharePopup(false)}
          shareableLink={shareableLink}
        />

      <div className="fixed inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <SelectionMenu
            x={selectionMenu.x}
            y={selectionMenu.y}
            visible={selectionMenu.visible}
            onEdit={handleEdit}
            menuRef={menuRef}
          />
          <PromptInput
            visible={showPromptInput}
            promptInput={promptInput}
            setPromptInput={setPromptInput}
            onSend={handleSendToAI}
            onCancel={hideUIElements}
            isProcessing={isProcessing}
            promptInputRef={promptInputRef}
            selectionMenu={selectionMenu}
          />
        </div>
      </div>

      <LoadingOverlay isLoading={isShareLoading} type="share" />
      <LoadingOverlay isLoading={isAILoading} type="ai" />
      <LoadingOverlay isLoading={isConvertLoading} type="convert" />
      <LoadingOverlay isLoading={isImportLoading} type="import" />
      <LoadingOverlay isLoading={isProcessing} type="process" />
    </div>
  );
};

export default LanguageEditor;
