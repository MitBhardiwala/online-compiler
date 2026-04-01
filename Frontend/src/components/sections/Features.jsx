import styles from "../../styles/style";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Helmet } from "react-helmet-async";
const Features = () => {
  const features = [
    {
      title: "Countless Languages",
      description:
        "Bro fr fr, all programming languages are here - Python, C, C++ etc no cap! 🔥",
      emoji: "🌎",
    },
    {
      title: "AI Mode",
      description:
        "This is AI, writes code automatically! No need to write code, just think and it's done 🙏🏻",
      emoji: "🛐",
    },
    {
      title: "Instant Compilation",
      description:
        "Write code and run instantly! It's so fast you won't even realize when it compiled and output arrived 💅",
      emoji: "⚡",
    },
    {
      title: "Code Sharing",
      description:
        "Flex the AI generated code under your name! Share with friends, Full flex mode ON 💯🚀",
      emoji: "📲",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Features - Online Compiler</title>
      </Helmet>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <section
            id="features"
            className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}
          >
            <div className="flex justify-center items-center mt-3 mb-3">
              <div className="w-full md:flex-row flex-col sm:mb-10 mb-6 relative">
                <h2 className={`${styles.heading2} flex justify-center`}>
                  Our Key Features
                </h2>
                <div className="w-full md:mt-0 mt-6">
                  <p
                    className={`${styles.paragraph} text-center max-w-[450px]`}
                  >
                    You already know these, but anyway....
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full feedback-container relative z-[1]">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex justify-between flex-col px-10 py-12 rounded-[1.25rem] feedback-card"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[3.125rem] mb-4">
                      {feature.emoji}
                    </span>
                    <h4 className="font-poppins font-semibold text-[1.25rem] leading-[2rem] text-white text-center">
                      {feature.title}
                    </h4>
                  </div>
                  <p className={`${styles.paragraph} mt-4 text-center`}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Features;
