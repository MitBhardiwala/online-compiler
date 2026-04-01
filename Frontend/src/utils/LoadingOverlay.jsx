import React, { useEffect } from "react";

const LoadingOverlay = ({ isLoading, type }) => {
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  if (!isLoading) return null;

  const messages = {
    share: "Generating shareable link...",
    ai: "Generating AI response...",
    convert: "Converting code...",
    import: "Importing file...",
    process: "Analyzing and updating code...",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">{messages[type]}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
