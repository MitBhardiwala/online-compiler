import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";

const CodeEditor = ({ code, setCode, language, onSelection,onKeyDown}) => {
  const getLanguageExtension = () => {
    switch (language) {
      case "javascript":
        return javascript();
      case "python":
        return python();
      case "cpp":
      case "c":
        return cpp();
      case "go":
        return javascript(); // Using JS highlighting as fallback
      case "php":
        return php();
      default:
        return python();
    }
  };

  const [selectionMenu, setSelectionMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    selectedText: "",
  });

  return (
    <div className="h-full w-full overflow-hidden bg-[#0F1117]">
      <CodeMirror
        value={code}
        onKeyDown={onKeyDown}
        height="100%"
        width="100%"
        theme="dark"
        extensions={[getLanguageExtension()]}
        onChange={(value) => setCode(value)}
        basicSetup={{
          lineNumbers: true,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
          indentOnInput: true,
          lineWrapping: true,
          foldGutter: false,
          scrollPastEnd: false,
          indentUnit: 4,
          tabSize: 4,
        }}
        style={{
          height: "100%",
          width: "100%",
          overflow: "auto",
          minHeight: "100%",
          maxHeight: "100%",
        }}
        indentWithTab={true}
        className="cm-wrapper h-full"
        onUpdate={(viewUpdate) => {

          if (viewUpdate.selectionSet) {

            onSelection &&
              onSelection(viewUpdate.state.selection, viewUpdate.view);
          }
        }}
      />
    </div>
  );
};

export default CodeEditor;
