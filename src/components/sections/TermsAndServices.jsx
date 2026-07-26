import styles from "../../styles/style";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Helmet } from "react-helmet-async";

const TermsAndServices = () => {
  const terms = [
    {
      title: "Terms of Use",
      content:
        "By using our online compiler, you agree to use it for learning and development purposes only. No illegal or harmful code execution is permitted.",
    },
    {
      title: "Code Privacy",
      content:
        "Your code remains your intellectual property. We do not store or share your code with third parties.",
    },
    {
      title: "Resource Limits",
      content:
        "To ensure fair usage, each compilation is limited to reasonable CPU and memory resources. Programs with infinite loops or excessive resource usage may be terminated.",
    },
    {
      title: "User Conduct",
      content:
        "Users must not attempt to breach security, overload systems, or use the service for malicious purposes.",
    },
    {
      title: "Service Availability",
      content:
        "While we strive for 24/7 availability, we don't guarantee uninterrupted service. Maintenance and updates may cause temporary downtime.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Terms and Services - Online Compiler</title>
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
              Terms and Services
            </h2>
            <p className={`${styles.paragraph} text-center max-w-[600px] mt-5`}>
              Please read these terms carefully before using our online compiler
              service.
            </p>
          </div>
        </div>

        <div className="max-w-[800px] w-full">
          {terms.map((term, index) => (
            <div
              key={index}
              className="mb-8 feedback-card p-6 rounded-[1.25rem]"
            >
              <h3 className="font-poppins font-semibold text-[1.25rem] text-white mb-4">
                {term.title}
              </h3>
              <p className={`${styles.paragraph}`}>{term.content}</p>
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

export default TermsAndServices;
