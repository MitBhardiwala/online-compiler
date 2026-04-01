import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar,Hero,CTA,Footer } from "../components/index.js";
import {
  Features,
  Team,
  HowItWorks,
  TermsAndServices,
  Suggestions,
  HelpCenter,
  NotFound,
} from "../components/sections/index.js";
import Editor from "../pages/Editor/Editor.jsx";
import LanguageEditor from "../pages/LanguageEditor/LanguageEditor.jsx"; 
import { SharedCodeLoader, LanguageRouteHandler } from "./routeHandlers.jsx";
import MainLayout from "../components/layout/mainLayout.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home route with MainLayout */}
      <Route 
        path="/" 
        element={
          <MainLayout>
            <Hero />
            <CTA />
          </MainLayout>
        } 
      />
      
      {/* Redirects */}
      <Route path="/home" element={<Navigate to="/" />} />
      
      {/* Main routes */}
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/team" element={<Team />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/terms-and-services" element={<TermsAndServices />} />
      <Route path="/suggestions" element={<Suggestions />} />
      <Route path="/help-center" element={<HelpCenter />} />
      
      {/* Dynamic routes */}
      <Route path="/:language" element={<LanguageRouteHandler />} />
      <Route path="/share/:id" element={<SharedCodeLoader />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;