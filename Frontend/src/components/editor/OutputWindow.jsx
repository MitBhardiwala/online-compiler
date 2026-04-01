import { VscDebugAlt } from "react-icons/vsc";

const OutputWindow = ({ output, onClear, input, setInput, onDebug, code }) => {
  // Check if output contains an error
  const hasError = output?.toLowerCase().includes("error");

  const handleDebugClick = () => {
    if (hasError && output && code) {
      onDebug({
        error: output,
        code: code,
      });
    }
  };

  return (
    <div className="h-full bg-[#00040f] border-t border-b md:border-l border-gray-800 flex flex-col">
      <div className="p-[9px] border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-gray-200">Output</h2>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="px-3 py-1 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4 overflow-auto flex-1">
        <div>
          <label className="block text-gray-200 mb-2">Input:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-gray-800 text-gray-200 p-2 rounded font-mono resize-none"
            rows="3"
            placeholder="Enter program input here..."
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-200">Output:</label>
            <button
              disabled={!hasError}
              onClick={handleDebugClick}
              className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-2"
            >
              <div className="relative">
                <VscDebugAlt className="text-lg" />
              </div>
            </button>
          </div>
          <textarea
            value={output}
            className="w-full h-[calc(100%-2rem)] bg-gray-800 text-gray-200 p-2 rounded font-mono resize-none"
            placeholder="Run your code to see the output"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default OutputWindow;
