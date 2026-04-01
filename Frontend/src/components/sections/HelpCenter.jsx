import styles from "../../styles/style";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
const HelpCenter = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I start coding?",
      answer:
        "Simply click the 'Get Started' button, choose your preferred programming language, and start writing your code in the editor. Click the green run button when you're ready to compile and execute.",
    },
    {
      question: "Which programming languages are supported?",
      answer:
        "We support multiple programming languages including Python, Java, C++, and more. Select your preferred language from the dropdown menu in the editor.",
    },
    {
      question: "Is there a time limit for code execution?",
      answer:
        "Yes, to ensure fair usage and system stability, each code execution has a reasonable time limit. If your code exceeds this limit, it will be terminated automatically.",
    },
    {
      question: "Can I save my code?",
      answer:
        "Currently, we don't provide code saving functionality. We recommend copying your code to a local file if you want to save it for later use.",
    },
    {
      question: "What should I do if I encounter an error?",
      answer:
        "Check the error message in the output window for specific details. Most errors are related to syntax or runtime issues in your code. If you're experiencing platform issues, try refreshing the page.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Help Center - Online Compiler</title>
      </Helmet>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>
      <section
        className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}
      >
        <div className="flex justify-center items-center mb-10">
          <div className="w-full md:flex-row flex-col relative z-[1]">
            <h2 className={`${styles.heading2} flex justify-center`}>
              Help Center
            </h2>
            <p className={`${styles.paragraph} text-center max-w-[600px] mt-5`}>
              Find answers to commonly asked questions about our online
              compiler.
            </p>
          </div>
        </div>

        <div className="max-w-[800px] w-full">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 feedback-card p-6 rounded-[1.25rem] cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-poppins font-semibold text-[1.125rem] text-white">
                  {faq.question}
                </h3>
                <span className="text-white text-xl">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <p className={`${styles.paragraph} mt-4`}>{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
      <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HelpCenter;
