import styles from "../../styles/style";
import { logo } from "../../assets";
import { footerLinks, socialMedia } from "../../config/constants";
import { Link } from "react-router-dom";

const Footer = () => (
  <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
    <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full`}>
      <div className="flex-1 flex flex-col justify-start mr-10 w-[100%] md:items-start items-center">
        <img
          src={logo}
          alt="onlinecompiler"
          className="w-[16.625rem] h-[4.5rem] object-contain"
        />
        <p
          className={`${styles.paragraph} mt-4 max-w-[12.5rem] md:ml-12 text-center md:text-left`}
        >
          You Think, We Write
        </p>
      </div>

      <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10">
        {footerLinks.map((footerLink) => (
          <div
            key={footerLink.title}
            className="flex flex-col ss:my-0 my-4 min-w-[9.375rem]"
          >
            <h4 className="font-poppins font-medium text-[1.125rem] leading-[1.6875rem] text-white">
              {footerLink.title}
            </h4>
            <ul className="list-none mt-4">
              {footerLink.links.map((link, index) => (
                <li
                  key={link.name}
                  className={`font-poppins font-normal text-[1rem] leading-[1.5rem] text-dimWhite hover:text-gray-300 cursor-pointer ${
                    index !== footerLink.links.length - 1 ? "mb-4" : "mb-0"
                  }`}
                >
                  {link.link.startsWith("http") ? (
                    <a href={link.link}>{link.name}</a>
                  ) : (
                    <Link to={link.link} onClick={() => window.scrollTo(0, 0)}>
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[0.0625rem] border-t-[#3FE3r45]">
      <p className="font-poppins font-normal text-center text-[1.125rem] leading-[1.6875rem] text-white">
        © {new Date().getFullYear()} OnlineCompiler. All Rights Reserved.
      </p>

      <div className="flex flex-row md:mt-0 mt-6">
        {socialMedia.map((social, index) => (
          <a key={social.id} href={social.link}>
            <img
              src={social.icon}
              alt={social.id}
              className={`w-[1.3125rem] h-[1.3125rem] object-contain cursor-pointer ${
                index !== socialMedia.length - 1 ? "mr-6" : "mr-0"
              }`}
            />
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Footer;
