import styles from "../../styles/style";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Button from "../common/Button";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
const Suggestions = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "feature",
    suggestion: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Submitting data:", formData);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/email/suggestions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit suggestion");
      }

      setFormData({
        name: "",
        email: "",
        category: "feature",
        suggestion: "",
      });
      toast.success("Thank you for your suggestion! We'll review it soon.", {
        duration: 4000,
        style: {
          background: "#28a745",
          color: "#fff",
        },
      });
    } catch (err) {
      setError(
        err.message || "Failed to submit suggestion. Please try again later."
      );
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Helmet>
        <title>Suggestions - Online Compiler</title>
      </Helmet>
      <Toaster position="top-center" />
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
              Suggestions
            </h2>
            <p className={`${styles.paragraph} text-center max-w-[600px] mt-5`}>
              Help us improve! Share your ideas and feedback with us.
            </p>
          </div>
        </div>

        <div className="max-w-[600px] w-full feedback-card p-8 rounded-[1.25rem]">
          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="text-white mb-2 block">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-dimBlue text-white border border-gray-600"
                required
              />
            </div>

            <div>
              <label className="text-white mb-2 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-dimBlue text-white border border-gray-600"
                required
              />
            </div>

            <div>
              <label className="text-white mb-2 block">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-dimBlue text-white border border-gray-600"
              >
                <option value="feature">New Feature</option>
                <option value="improvement">Improvement</option>
                <option value="bug">Bug Report</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-white mb-2 block">Your Suggestion</label>
              <textarea
                name="suggestion"
                value={formData.suggestion}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-dimBlue text-white border border-gray-600 min-h-[9.375rem]"
                required
              ></textarea>
            </div>

            <div className="flex justify-center">
              <Button
                text={isSubmitting ? "Submitting..." : "Submit Suggestion"}
                onClick={(e) => handleSubmit(e)}
                disabled={isSubmitting}
              />
            </div>
          </form>
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

export default Suggestions;
