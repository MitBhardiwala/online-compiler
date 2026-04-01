import React, { useState, createContext, useContext } from "react";
import { languageOptions } from "../../constants/languageOptions";

// Create a context for the language modal state

// State variables that will be exported
let showLanguageModalState = false;
let setShowLanguageModalState = () => {};

const LanguageSelectionModal = ({
  currentLanguage,
  handleConvert,
  code,
  isLanguageEditor,
  navigate,
  modalTitle,
}) => {
  // Create state internally rather than receiving as props
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Create state and assign to the exported variables
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Update the exported variables
  showLanguageModalState = showLanguageModal;
  setShowLanguageModalState = setShowLanguageModal;

  if (!showLanguageModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-[#1E1E1E] p-6 rounded-lg shadow-xl w-full max-w-md">
        <button
          onClick={() => {
            setShowLanguageModal(false);
            setSelectedLanguage(null); // Reset selection when closing modal
          }}
          className="absolute top-3 right-4 text-gray-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h3 className="text-xl text-white mb-4 text-left">{modalTitle}</h3>
        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {languageOptions.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setSelectedLanguage(lang.id);
              }}
              disabled={lang.id === currentLanguage}
              className={`p-3 text-white rounded transition-colors text-left ${
                lang.id === currentLanguage
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : lang.id === selectedLanguage
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-[#2A2B36] hover:bg-[#3A3B46]"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            if (selectedLanguage) {
              handleConvert(
                code,
                currentLanguage,
                selectedLanguage,
                isLanguageEditor,
                navigate
              );
              setShowLanguageModal(false);
              setSelectedLanguage(null); // Reset the selection
            }
          }}
          disabled={!selectedLanguage}
          className="mt-4 w-full p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded"
        >
          Convert
        </button>
      </div>
    </div>
  );
};

// Export the component and state variables
export default LanguageSelectionModal;
export {
  showLanguageModalState as showLanguageModal,
  setShowLanguageModalState as setShowLanguageModal,
};
