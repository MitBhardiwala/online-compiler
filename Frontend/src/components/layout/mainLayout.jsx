import styles from "../../styles/style";
import { Navbar, Footer } from "../index.js"; 

/**
 * MainLayout component - common layout wrapper for pages with navbar and footer
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render inside the layout
 */
const MainLayout = ({ children }) => {
  return (
    <>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>
      
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          {children}
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

export default MainLayout;