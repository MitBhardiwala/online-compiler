import styles from "../../styles/style";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { alex, bholu, chetram, robocop } from "../../assets";
import { Helmet } from "react-helmet-async";
const Team = () => {
  const teamMembers = [
    {
      name: "Chetram Singh",
      position: "Lead Thinker",
      image: chetram,
      description: "Thinking is important.",
    },
    {
      name: "Bholu",
      position: "Lead Cursor User",
      image: bholu,
      description: "Cursor will handle it.",
    },
    {
      name: "Alex Dacid",
      position: "Lead Div Centerer",
      image: alex,
      description: "Every div is centered.",
    },
    {
      name: "Robocop",
      position: "Seobility and Gyaan Lead",
      image: robocop,
      description: "Narayan Murthy's Son.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Team - Online Compiler</title>
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
          <div className="w-full md:flex-row flex-col sm:mb-8 relative z-[1]">
            <h2 className={`${styles.heading2} flex justify-center`}>
              Meet Our Team
            </h2>
            <div className="w-full md:mt-0 mt-6">
              <p className={`${styles.paragraph} text-center max-w-[450px]`}>
                Thank You <strong>Sam Altman</strong> and{" "}
                <strong>Claude.</strong> <br></br>{" "}
                <strong>Long live AI.</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center w-full feedback-container relative z-[1]">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex justify-between flex-col px-10 py-12 rounded-[1.25rem] max-w-[370px] md:mr-10 sm:mr-5 mr-0 my-5 feedback-card"
            >
              <div className="flex flex-col items-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-[10.9375rem] h-[10.9375rem] rounded-[0.3125rem] mb-4"
                />
                <h4 className="font-poppins font-semibold text-[1.25rem] leading-[2rem] text-white text-center">
                  {member.name}
                </h4>
                <p className="font-poppins font-normal text-[1rem] leading-[1.5rem] text-dimWhite text-center mt-2">
                  {member.position}
                </p>
              </div>
              <p className={`${styles.paragraph} mt-4 text-center`}>
                {member.description}
              </p>
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

export default Team;
