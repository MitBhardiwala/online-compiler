import React, { useEffect, useRef } from "react";

const PromptInput = ({
  visible,
  promptInput,
  setPromptInput,
  onSend,
  onCancel,
  isProcessing,
  promptInputRef,
  selectionMenu,
}) => {
  const containerRef = useRef(null);

  // Move this outside the conditional rendering
  useEffect(() => {
    if (
      visible &&
      promptInputRef.current &&
      document.activeElement === promptInputRef.current
    ) {
      const input = promptInputRef.current;
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  }, [promptInput, visible, promptInputRef]);

  useEffect(() => {
    if (visible && containerRef.current) {
      const box = containerRef.current;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const boxWidth = box.offsetWidth;
      const boxHeight = box.offsetHeight;
      const isMobile = viewportWidth < 768;

      let finalX, finalY;

      if (isMobile) {
        finalX = Math.max(10, (viewportWidth - boxWidth) / 2);
        finalY = Math.max(10, (viewportHeight - boxHeight) / 2);
      } else {
        const clickX = selectionMenu?.promptPosition?.x ?? viewportWidth / 2;
        if (clickX - boxWidth / 2 < 20) {
          finalX = 20;
        } else if (clickX + boxWidth / 2 > viewportWidth - 20) {
          finalX = viewportWidth - boxWidth - 20;
        } else {
          finalX = clickX - boxWidth / 2;
        }
        finalY = selectionMenu?.promptPosition?.y ?? "30%";
      }

      box.style.left = `${finalX}px`;
      box.style.top = `${finalY}px`;
    }
  }, [visible, selectionMenu?.promptPosition]);

  const handleKeyPress = (e) => {
    if (e.key === "Escape") {
      onCancel();
    } else if (e.key === "Enter" && !e.shiftKey && promptInput) {
      e.preventDefault();
      onSend();
    }
  };

  // Early return moved after hooks
  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed z-[9999] bg-[#00040f] rounded-lg shadow-2xl border border-blue-600"
      style={{
        width: "min(600px, 95vw)",
        maxHeight: "90vh",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-blue-600">
        <span className="text-gray-400 text-sm">AI MODE</span>
      </div>

      <div className="px-2 py-1">
        <textarea
          ref={promptInputRef}
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full bg-transparent text-white resize-none focus:outline-none text-sm"
          style={{
            fontFamily: "'Fira Code', monospace",
            minHeight: "24px",
            maxHeight: "72px",
            overflowY: "auto",
            lineHeight: "18px",
          }}
          placeholder="New code instructions..... Press Enter to send"
          autoFocus
          onInput={(e) => {
            e.target.style.height = "24px";
            const maxHeight = 72;
            const scrollHeight = Math.min(e.target.scrollHeight, maxHeight);
            e.target.style.height = `${scrollHeight}px`;
          }}
        />
      </div>

      <div className="flex justify-between items-center px-3 py-2 border-t border-blue-600">
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white text-sm touch-manipulation"
        >
          Cancel
        </button>
        {promptInput && (
          <button
            onClick={onSend}
            disabled={isProcessing}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 touch-manipulation"
          >
            {isProcessing ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Send"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Use memo to optimize re-renders
export default React.memo(PromptInput);
