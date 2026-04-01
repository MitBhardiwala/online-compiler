import styles from "../../styles/style";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>404 - Not Found</title>
      </Helmet>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>
      <section
        className={`${styles.flexCenter} mt-2 mb-2 flex-col`}
      >
        <h1 className={`${styles.heading1} text-[5.125rem] font-semibold text-white text-center mb-4`}>404</h1>
        <h2 className={`${styles.heading2} text-center mb-8`}>
          Page Not Found
        </h2>
        <p className={`${styles.paragraph} text-center max-w-[37.5rem] mb-8`}>
          Oops! The page you're looking for doesn't exist. You might have
          mistyped the address or the page may have moved.
        </p>
        <Button text="Go Home" onClick={handleGoHome} />
      </section>
      <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default NotFound;
