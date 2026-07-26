import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AppRoutes from "./Routes/routes.jsx";

const App = () => (
  <HelmetProvider>
    <BrowserRouter>
      <div className="bg-primary w-full overflow-hidden">
        <AppRoutes />
      </div>
    </BrowserRouter>
  </HelmetProvider>
);

export default App;