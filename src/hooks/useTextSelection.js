import { useState, useRef, useEffect } from 'react';

export const useTextSelection = () => {
    const [selectionMenu, setSelectionMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        selectedText: "",
        promptPosition: null,
    });
    const [showPromptInput, setShowPromptInput] = useState(false);
    const [promptInput, setPromptInput] = useState("");
    const menuRef = useRef(null);
    const promptInputRef = useRef(null);

    const handleTextSelection = (selection, editor) => {
        if (selection && selection.main.from !== selection.main.to) {
            const selectedText = editor.state.sliceDoc(
                selection.main.from,
                selection.main.to
            );

            requestAnimationFrame(() => {
                const pos = editor.coordsAtPos(selection.main.from);
                if (pos) {
                    const isMobile = window.innerWidth < 768;
                    setSelectionMenu({
                        visible: true,
                        x: isMobile ? Math.min(pos.left, window.innerWidth - 100) : pos.left,
                        y: isMobile ? pos.bottom + 10 : pos.top,
                        selectedText,
                        editor,
                    });
                    setShowPromptInput(false);
                }
            });
        } else {
            setSelectionMenu((prev) => ({ ...prev, visible: false }));
            setShowPromptInput(false);
        }
    };

    const hideUIElements = () => {
        setShowPromptInput(false);
        setSelectionMenu((prev) => ({ ...prev, visible: false }));
    };
    const handleEdit = (e) => {
        e.stopPropagation();
        setShowPromptInput(true);
        setPromptInput("");

        const isMobile = window.innerWidth < 768;
        setSelectionMenu((prev) => ({
            ...prev,
            promptPosition: {
                x: isMobile ? window.innerWidth / 2 : prev.x,
                y: isMobile ? window.innerHeight / 2 : prev.y + 30,
            },
        }));

        setTimeout(() => {
            if (promptInputRef.current) {
                promptInputRef.current.focus();
            }
        }, 0);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                if (
                    !promptInputRef.current ||
                    !promptInputRef.current.contains(event.target)
                ) {
                    setSelectionMenu((prev) => ({ ...prev, visible: false }));
                    setShowPromptInput(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return {
        selectionMenu,
        showPromptInput,
        promptInput,
        setPromptInput,
        menuRef,
        promptInputRef,
        handleTextSelection,
        handleEdit,
        setSelectionMenu,
        hideUIElements
    };
}; 