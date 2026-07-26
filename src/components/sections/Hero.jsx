import styles from "../../styles/style";
import { Helmet } from "react-helmet-async";

import {
  FaPython,
  FaJs,
  FaPhp,
} from "react-icons/fa";
import { SiCplusplus, SiGo, SiC } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const languages = [
    { id: "python", name: "Python", icon: FaPython },
    { id: "javascript", name: "JS", icon: FaJs },
    { id: "c", name: "C", icon: SiC },
    { id: "cpp", name: "C++", icon: SiCplusplus },
    { id: "go", name: "Go", icon: SiGo },
    { id: "php", name: "PHP", icon: FaPhp },
  ];

  const handleLanguageClick = (languageId) => {
    navigate(`/${languageId}`);
  };

  return (
    <>
      <Helmet>
        <title>Home - Online Compiler</title>
      </Helmet>
      <div className="fixed top-0 left-0 w-full h-[70vh] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/10 to-transparent animate-spotlight" />
      </div>
      <section
        id="home"
        className={`relative flex flex-col items-center justify-center text-center ${styles.paddingY}`}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-purple-500/20 via-blue-500/5 to-transparent blur-3xl animate-fade-in" />

        <div
          className={`relative w-full max-w-[1000px] ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
        >
          <h1 className="text-gradient font-poppins font-semibold text-[3.25rem] md:text-[4rem] leading-tight mb-6 text-center mx-auto">
            Online Compiler
          </h1>

          <p
            className={`${styles.paragraph} max-w-[50rem] text-center text-white text-xl mb-12 mx-auto`}
          >
            Quick-read tutorials with code examples that you can run and
            copy—perfect for self-paced learning.
          </p>

          <div className="flex flex-wrap justify-center gap-4 w-full">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageClick(lang.id)}
                className="flex items-center justify-center gap-3 p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-all duration-300 w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.6875rem)] lg:w-[calc(16.66%-0.875rem)]"
              >
                {lang.icon && <lang.icon className="text-xl text-[#1D1B48]" />}
                <span className="font-medium text-[#1D1B48]">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
