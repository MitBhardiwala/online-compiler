import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NotFound } from "../components/sections/index.js";
import LanguageEditor from "../pages/LanguageEditor/LanguageEditor";

// Valid language list for validation
const VALID_LANGUAGES = [
  "python",
  "javascript",
  "cpp",
  "c",
  "go",
  "php",
];

export const SharedCodeLoader = () => {
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedCode = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/share/${id}`
        );
        const data = await response.json();

        if (data.success) {
          // Directly navigate with code data
          navigate("/editor", {
            replace: true,
            state: {
              code: data.code,
              language: data.language,
            },
          });
        } else {
          setError(data.error);
          setTimeout(() => {
            navigate("/editor");
          }, 3000);
        }
      } catch (error) {
        setError("Failed to load shared code");
        setTimeout(() => {
          navigate("/editor");
        }, 3000);
      }
    };

    fetchSharedCode();
  }, [id, navigate]);

  return error ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] p-4 rounded-lg shadow-xl">
        <p className="text-white">{error}</p>
      </div>
    </div>
  ) : (
    <div className="h-screen bg-primary flex items-center justify-center">
      <p className="text-white">Loading shared code...</p>
    </div>
  );
};

export const LanguageRouteHandler = () => {
  const { language } = useParams();

  if (!VALID_LANGUAGES.includes(language)) {
    return <NotFound />;
  }

  return <LanguageEditor />;
};