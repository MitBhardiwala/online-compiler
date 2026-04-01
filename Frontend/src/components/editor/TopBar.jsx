import React, { useState, useRef } from "react";
import { languageOptions } from "../../constants/languageOptions";
import LoadingOverlay from "../../utils/LoadingOverlay";
import { useNavigate } from "react-router-dom";
import { setShowLanguageModal } from "../common/langaugeSelectorModal";
import LanguageSelectionModal from "../common/langaugeSelectorModal";
import { showAlert } from "../../utils/alert";

const getLanguageFromExtension = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  const extensionMap = {
    js: "javascript",
    py: "python",
    cpp: "cpp",
    c: "c",
    go: "go",
    php: "php",
  };
  return extensionMap[extension];
};

const TopBar = ({
  fileName,
  isAIMode,
  setIsAIMode,
  bgmodePrompt,
  handleShare,
  handleDownload,
  handleSubmit,
  handleConvert,
  isLoading,
  isShareLoading,
  isDownloadLoading,
  isStreaming,
  currentLanguage,
  handleFileUpload,
  setBgmodePrompt,
  code,
  isLanguageEditor = false,
  unSupportedFileContent,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const content = await file.text();
      const detectedLanguage = getLanguageFromExtension(file.name);

      await handleFileUpload(
        content,
        detectedLanguage,
        currentLanguage,
        isLanguageEditor,
        navigate
      );
      setIsImporting(false);
    } catch (error) {
      showAlert("Error reading file. Please try again.", "error");
      setIsImporting(false);
      console.error("Error reading file:", error);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isImporting} type="import" />
      <div className="flex items-center justify-between p-[9px] border-b border-t border-gray-800 bg-[#00040f] flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-200">{fileName}</h2>
          {!isAIMode && (
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              // Update accept to only include code file extensions
              accept=".js,.py,.cpp,.c,.go,.php"
            />
          )}
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => {
              setIsAIMode(!isAIMode);
              setBgmodePrompt("");
            }}
            className={`px-2 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base ${
              isAIMode
                ? "bg-purple-700 hover:bg-purple-600"
                : "bg-gray-700 hover:bg-gray-600"
            } text-white rounded transition-colors`}
          >
            AI MODE {isAIMode ? "" : ""}
          </button>
          {!isAIMode && (
            <>
              <div className="relative sm:hidden">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base bg-blue-800 hover:bg-blue-700 text-white rounded transition-colors h-[26px] sm:h-[32px] flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mt-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M6 10a2 2 0 110-4 2 2 0 010 4zM12 10a2 2 0 110-4 2 2 0 010 4zM18 10a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1E1E1E] rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowLanguageModal(true);
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-blue-700"
                      >
                        Convert Code
                      </button>
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-blue-700"
                      >
                        Upload Code File
                      </button>
                      <button
                        onClick={() => {
                          handleShare();
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-blue-700"
                        disabled={isShareLoading}
                      >
                        {isShareLoading ? "Sharing..." : "Share"}
                      </button>
                      <button
                        onClick={() => {
                          handleDownload();
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-blue-700"
                        disabled={isDownloadLoading}
                      >
                        {isDownloadLoading ? "Downloading..." : "Download"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:flex sm:gap-2">
                <button
                  onClick={() => setShowLanguageModal(true)}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base bg-blue-800 hover:bg-blue-700 text-white rounded transition-colors"
                  title="Convert Code"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base bg-blue-800 hover:bg-blue-700 text-white rounded transition-colors"
                  title="Upload Code File"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleShare}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base bg-blue-800 hover:bg-blue-700 text-white rounded transition-colors"
                  disabled={isShareLoading}
                >
                  {isShareLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    "Share"
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base bg-blue-800 hover:bg-blue-700 text-white rounded transition-colors"
                  title="Download Code"
                  disabled={isDownloadLoading}
                >
                  {isDownloadLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </>
          )}
          <button
            onClick={handleSubmit}
            className={`px-2 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base ${
              isLoading
                ? "bg-red-500 hover:bg-red-600"
                : isAIMode
                ? "bg-purple-800 hover:bg-purple-700"
                : "bg-green-800 hover:bg-green-700"
            } text-white rounded transition-colors`}
            disabled={isStreaming}
          >
            {isLoading ? (
              <>
                <div className="sm:hidden flex items-center justify-center">
                  <div className="relative w-5 h-5">
                    {/* Static square in the center */}
                    <div className="absolute inset-0 m-auto w-2 h-2 bg-white"></div>
                    {/* Rotating circle with gradient */}
                    <div className="absolute inset-0 animate-spin">
                      <div className="w-5 h-5 rounded-full border-2 border-transparent border-t-white"></div>
                    </div>
                  </div>
                </div>
                <span className="hidden sm:flex items-center gap-2">
                  <div className="relative w-5 h-5">
                    {/* Static square in the center */}
                    <div className="absolute inset-0 m-auto w-2 h-2 bg-white"></div>
                    {/* Rotating circle with gradient */}
                    <div className="absolute inset-0 animate-spin">
                      <div className="w-5 h-5 rounded-full border-2 border-transparent border-t-white"></div>
                    </div>
                  </div>
                  Stop
                </span>
              </>
            ) : isAIMode ? (
              "Send"
            ) : (
              "Run"
            )}
          </button>
        </div>
      </div>

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        currentLanguage={currentLanguage}
        handleConvert={handleConvert}
        code={unSupportedFileContent || code}
        isLanguageEditor={isLanguageEditor}
        navigate={navigate}
        modalTitle="Convert Code To:"
      />
    </>
  );
};

export default TopBar;
