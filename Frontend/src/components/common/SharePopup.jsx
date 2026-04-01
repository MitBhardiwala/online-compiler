import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const SharePopup = ({ 
  isOpen, 
  onClose, 
  shareableLink,
}) => {
  const [buttonState, setButtonState] = useState("default");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setButtonState("copied");
    setTimeout(() => setButtonState("default"), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-xl w-full max-w-[320px] sm:max-w-md">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg sm:text-xl text-white">Share Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <QRCodeSVG
            value={shareableLink}
            size={160}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="L"
            includeMargin={false}
          />
          <div className="w-full">
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="w-full p-2 text-sm bg-[#2A2B36] text-white rounded border border-gray-700"
            />
          </div>
          <button
            onClick={handleCopyLink}
            disabled={buttonState === "copied"}
            className={`px-4 py-2 text-white rounded transition-colors w-full text-sm ${
              buttonState === "default"
                ? "bg-blue-800 hover:bg-blue-700"
                : "bg-green-600 cursor-not-allowed"
            }`}
          >
            {buttonState === "default" ? "Copy Link" : "Copied"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;