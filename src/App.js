import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/HomePage";
import StudyPage from "./pages/StudyPage";
import ProjectPage from "./pages/ProjectPage";
import SportsPage from "./pages/SportsPage";
import HobbyPage from "./pages/HobbyPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/sports" element={<SportsPage />} />
        <Route path="/hobby" element={<HobbyPage />} />
      </Route>
    </Routes>
  );
}
