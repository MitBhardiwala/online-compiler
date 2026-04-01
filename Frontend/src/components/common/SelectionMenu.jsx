import React from "react";

const SelectionMenu = ({ x, y, visible, onEdit, menuRef }) => {
  if (!visible) return null;

  const isMobile = window.innerWidth < 768;

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] flex gap-2 bg-[#2A2B36] rounded-md shadow-lg p-1"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: isMobile ? "translateX(-50%)" : "translate(-50%, -100%)",
        maxWidth: "90vw",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button
        className="flex items-center px-3 py-1.5 text-sm text-white border border-gray-500 rounded hover:bg-[#3A3B46] touch-manipulation"
        onClick={onEdit}
      >
        Edit
      </button>
    </div>
  );
};

export default SelectionMenu;
