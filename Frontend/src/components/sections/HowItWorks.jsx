import { useNavigate } from "react-router-dom";
import styles from "../../styles/style";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Button from "../common/Button";
import { Helmet } from "react-helmet-async";
const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Language",
      icon: "🔤", // Replace with actual icon/image
    },
    {
      number: "02",
      title: "Write Code",
      icon: "💻", // Replace with actual icon/image
    },
    {
      number: "03",
      title: "Press Green Button",
      icon: "✅", // Replace with actual icon/image
    },
  ];
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/editor");
  };

  return (
    <>
      <Helmet>
        <title>How It Works - Online Compiler</title>
      </Helmet>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>
      <section
        className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}
      >
        <div className="flex justify-center items-center">
          <div className="w-full md:flex-row flex-col sm:mb-16 mb-6 relative z-[1]">
            <h2 className={`${styles.heading2} flex justify-center`}>
              How It Works
            </h2>
            <div className="w-full md:mt-0 mt-6">
              <p className={`${styles.paragraph} text-center max-w-[450px]`}>
                Steps are for losers, <br></br>
                <strong>Just use AI Mode 🙏🏻</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center w-full feedback-container relative z-[1]">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex justify-between flex-col px-10 py-12 rounded-[1.25rem] max-w-[370px] md:mr-10 sm:mr-5 mr-0 my-5 feedback-card"
            >
              <div className="flex flex-row items-center">
                <div className="w-[4rem] h-[4rem] rounded-full flex justify-center items-center bg-dimBlue">
                  <span className="text-[3.125rem]">{step.icon}</span>
                </div>
                <div className="flex flex-col ml-4">
                  <span className="font-poppins font-normal text-[1.25rem] text-white leading-[1.5rem]">
                    Step {step.number}
                  </span>
                  <h4 className="font-poppins font-semibold text-[1.25rem] leading-[2rem] text-white mt-1">
                    {step.title}
                  </h4>
                </div>
              </div>
              <p className={`${styles.paragraph} mt-4 text-center`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full mt-10 flex flex-col items-center">
          <h3 className={`${styles.heading3} mb-6 text-center text-white`}>
            Ready to Start Coding?
          </h3>
          <Button text="Get Started" onClick={handleClick} />
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

export default HowItWorks;
