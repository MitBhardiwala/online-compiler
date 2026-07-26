import { useState } from "react";
import { close, logo, menu } from "../../assets";
import { navLinks } from "../../config/constants";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (navId) => {
    if (navId === "home") {
      navigate("/");
    } else if (navId === "features") {
      navigate("/features");
    } else if (navId === "team") {
      navigate("/team");
    } else if (navId === "how-it-works") {
      navigate("/how-it-works");
    } else {
      // Keep the anchor behavior for other links
      window.location.href = `#${navId}`;
    }
  };

  return (
    <nav className="w-full flex py-3 justify-between items-center navbar">
      <img
        src={logo}
        alt="onlinecompiler"
        className="w-[2.8125rem] h-[2.8125rem]"
      />
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[0.875rem] ${
              index === navLinks.length - 1 ? "mr-0" : "mr-8"
            } text-white`}
            onClick={() => handleNavClick(nav.id)}
          >
            {nav.title}
          </li>
        ))}
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[1.5rem] h-[1.5rem] object-contain"
          onClick={() => setToggle((prev) => !prev)}
        />
        <div
          className={`${
            toggle ? "flex" : "hidden"
          } p-4 bg-black-gradient absolute top-16 right-0 nx-4 my-2 min-w-[8.75rem] rounded-xl sidebar z-[1000]`}
        >
          <ul className="list-none flex flex-col justify-end items-center flex-1">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-normal cursor-pointer text-[1rem] ${
                  index === navLinks.length - 1 ? "mr-0" : "mb-4"
                } text-white`}
                onClick={() => handleNavClick(nav.id)}
              >
                {nav.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
