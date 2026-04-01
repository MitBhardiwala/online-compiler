import styles from "../../styles/style";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/editor");
  };

  return (
    <section
      className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[1.25rem] box-shadow border-2 border-transparent animate-border-pulse relative overflow-hidden w-[80%] mx-auto`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/10 to-transparent opacity-25 pointer-events-none" />
      <div className="flex-1 flex flex-col relative z-10">
        <h2 className={styles.heading2}>Since you are here, run some code!</h2>
        <p className={`${styles.paragraph} max-w-[29.375rem] mt-5`}>
          AI mode is here to help you 🙏🏻
        </p>
      </div>

      <div
        className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10 relative z-10`}
      >
        <Button text="Get Started" onClick={handleClick} />
      </div>
    </section>
  );
};

export default CTA;
