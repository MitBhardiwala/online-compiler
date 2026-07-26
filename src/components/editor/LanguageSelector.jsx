const LanguageSelector = ({
  selectedLanguage,
  setSelectedLanguage,
  isMobileView,
}) => {
  const languages = [
    { id: "python", icon: "Python" },
    { id: "javascript", icon: "JS" },
    { id: "cpp", icon: "C++" },
    { id: "c", icon: "C" },
    { id: "go", icon: "Go" },
    { id: "php", icon: "PHP" },
  ];

  return (
    <div
      className={`flex ${
        isMobileView ? "flex-row overflow-x-auto" : "flex-col"
      } gap-2 bg-[#00040f] border-r border-gray-800`}
    >
      {languages.map((lang) => (
        <button
          key={lang.id}
          className={`p-2 ${
            isMobileView ? "rounded" : "rounded-l"
          } transition-all whitespace-nowrap ${
            selectedLanguage === lang.id
              ? "bg-gray-800 text-gray-200 relative"
              : "text-gray-400 hover:bg-gray-700"
          }`}
          onClick={() => setSelectedLanguage(lang.id)}
        >
          {lang.icon}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
