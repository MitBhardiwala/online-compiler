import styles from "../../styles/style";
import { styles as localStyles } from "./EditorStyles";
import { useState, useRef, useEffect } from "react";
import LanguageSelector from "../../components/editor/LanguageSelector";
import CodeEditor from "../../components/editor/CodeEditor";
import OutputWindow from "../../components/editor/OutputWindow";
import { Helmet } from "react-helmet-async";
import { getFileExtension } from "../../services/utils/helpers";
import { QRCodeSVG } from "qrcode.react";
import { logo } from "../../assets";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import LoadingOverlay from "../../utils/LoadingOverlay";
import TopBar from "../../components/editor/TopBar";

import { useAIFeatures } from "../../hooks/useAIFeatures";
import { useCodeExecution } from "../../hooks/useCodeExecution";
import { useFileOperations } from "../../hooks/useFileOperations";
import { useTextSelection } from "../../hooks/useTextSelection";
import { useMobileView } from "../../hooks/useMobileView";
import { SelectionMenu, PromptInput } from "../../components/common";
import SharePopup from "../../components/common/SharePopup";

const Editor = () => {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const containerRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [sharedCode, setSharedCode] = useState(null);
  const isMobileView = useMobileView();

  // Finally use useTextSelection
  const {
    selectionMenu,
    showPromptInput,
    promptInput,
    setPromptInput,
    menuRef,
    promptInputRef,
    handleTextSelection,
    handleEdit,
    hideUIElements,
    setSelectionMenu,
  } = useTextSelection();

  // First, initialize useCodeExecution to get isLoading and setIsLoading
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

  // Then use useAIFeatures with the required state setters
  const {
    isAIMode,
    setIsAIMode,
    bgmodePrompt,
    setBgmodePrompt,
    isAILoading,
    isProcessing,
    handleAISubmit,
    handleAIEdit,
    setIsProcessing,
  } = useAIFeatures(setCode, setIsLoading, setIsStreaming, selectedLanguage);

  // Then use useFileOperations with all required state setters
  const {
    isDownloadLoading,
    isImportLoading,
    isConvertLoading,
    handleDownload,
    handleFileUpload,
    handleConvert,
  } = useFileOperations(
    setCode,
    setIsLoading,
    setIsStreaming,
    setSelectedLanguage
  );

  const getDefaultCode = (language) => {
    if (isAIMode) {
      return "";
    }
    return "";
  };

  // Updated first useEffect for language initialization
  useEffect(() => {
    const languageParam = searchParams.get("language");
    const navigationState = location.state?.initialLanguage;
    const hasInitialCode = !!location.state?.initialCode;

    if (navigationState) {
      setSelectedLanguage(navigationState);
      if (!hasInitialCode) {
        setCode(getDefaultCode(navigationState));
        navigate(location.pathname, { replace: true, state: {} });
      }
    } else if (languageParam) {
      setSelectedLanguage(languageParam);
      setCode(getDefaultCode(languageParam));
    }

    setOutput("");
    setInput("");
  }, [selectedLanguage, isAIMode, searchParams, location, navigate]);

  // Updated second useEffect for code initialization
  useEffect(() => {
    if (location.state?.initialCode) {
      setCode(location.state.initialCode);
      if (location.state.initialLanguage) {
        setSelectedLanguage(location.state.initialLanguage);
      }
      navigate(location.pathname, { replace: true, state: {} });
    }

    if (location.state?.code) {
      const newCode = location.state.code;
      setSharedCode(newCode);
      setCode(newCode);
      setSelectedLanguage(location.state.language || "python");
      navigate(location.pathname, { replace: true, state: {} });
    }

    if (sharedCode) {
      setCode(sharedCode);
    }

    const languageParam = searchParams.get("language");
    if (languageParam && !location.state?.initialLanguage) {
      setSelectedLanguage(languageParam);
    }
  }, [location, searchParams, navigate]);

  const handleLanguageChange = (newLanguage) => {
    if (isStreaming) {
      showAlert("Please wait for code to finish loading", "warning");
      return;
    }
    setSelectedLanguage(newLanguage);
    setCode("");
  };

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
        selectedLanguage
      );
      setPromptInput("");
    } catch (error) {
      console.error("AI edit failed:", error);
      showAlert(`AI edit failed: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Editor - Online Compiler</title>
      </Helmet>
      <div className="w-full max-h-fit bg-[#00040f]">
        <nav className="w-full h-[10vh] bg-[#00040f] border-b border-[#2A2B36] px-4 py-2 flex justify-between items-center">
          <div>
            <img src={logo} alt="Online Compiler Logo" className="w-16 h-auto" />
          </div>
          <div
            onClick={() => navigate("/")}
            className="text-white text-xl font-semibold cursor-pointer hover:text-gray-300 transition-colors"
          >
            OnlineCompiler.in
          </div>
        </nav>

        <div className={`${styles.flexStart} w-full `}>
          <div
            className={`${styles.boxWidth} h-[90vh] flex flex-col sm:flex-row gap-0 `}
          >
            <div className="w-full sm:w-20 bg-[#00040f] border-b border-t sm:border-r border-[#2A2B36]">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={handleLanguageChange}
                isMobileView={isMobileView}
                disabled={isStreaming}
              />
            </div>

            <div
              ref={containerRef}
              className="flex-1 flex flex-col sm:flex-row h-full overflow-hidden"
            >
              <div
                className="flex-1 flex flex-col bg-[#0F1117] h-[50vh] sm:h-full overflow-hidden"
                style={{ width: isMobileView ? "100%" : "50%", minHeight: 0 }}
              >
                <TopBar
                  fileName={`main.${getFileExtension(selectedLanguage)}`}
                  isAIMode={isAIMode}
                  setIsAIMode={setIsAIMode}
                  handleShare={() => handleShare(code, selectedLanguage)}
                  handleDownload={() => handleDownload(code, selectedLanguage)}
                  handleSubmit={
                    isAIMode
                      ? handleAISubmit
                      : () => handleRunCode(code, selectedLanguage)
                  }
                  handleConvert={handleConvert}
                  handleFileUpload={handleFileUpload}
                  isLoading={isLoading}
                  isShareLoading={isShareLoading}
                  isDownloadLoading={isDownloadLoading}
                  isStreaming={isStreaming}
                  currentLanguage={selectedLanguage}
                  bgmodePrompt={bgmodePrompt}
                  setBgmodePrompt={setBgmodePrompt}
                  code={code}
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
                      language={selectedLanguage}
                      onSelection={handleTextSelection}
                      onKeyDown={handleKeyDown}
                    />
                  )}
                </div>
              </div>

              <div
                className="h-[50vh] sm:h-full bg-[#00040f]"
                style={{ width: isMobileView ? "100%" : "50%" }}
              >
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

        <SharePopup
          isOpen={showSharePopup}
          onClose={() => setShowSharePopup(false)}
          shareableLink={shareableLink}
        />

        <LoadingOverlay isLoading={isShareLoading} type="share" />
        <LoadingOverlay isLoading={isAILoading} type="ai" />
        <LoadingOverlay isLoading={isConvertLoading} type="convert" />
        <LoadingOverlay isLoading={isImportLoading} type="import" />
        <LoadingOverlay isLoading={isProcessing} type="process" />
      </div>

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
    </>
  );
};

export default Editor;
