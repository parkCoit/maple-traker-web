import type { ReactElement } from "react";
import { Footer } from "./components/common/Footer";
import TopNavigation from "./components/common/TopNavigation";
import FarmingPage from "./pages/FarmingPage";
import MainPage from "./pages/MainPage";
import { getSessionToken } from "./utils/auth";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default function App() {
  const location = useLocation();

  const hideTopNavPaths = ["/", "/login", "/auth", "/error"];

  const showTopNav = !hideTopNavPaths.includes(location.pathname);
  const showFooter = !hideTopNavPaths.includes(location.pathname);

  return (
    <div className="App">
      {showTopNav && <TopNavigation />}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/farming"
          element={<ProtectedRoute element={<FarmingPage />} />}
        />
        <Route path="*" element={<Navigate to="/error" />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}
