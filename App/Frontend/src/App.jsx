import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import MonitorHeart from "./pages/MonitorHeart";
import Database from "./pages/Database";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitorHeart" element={<MonitorHeart />} />
          <Route path="/database" element={<Database />} />
          <Route path="/services" element={<Services />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
