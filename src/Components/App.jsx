import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout";

import HobbyPage from "../Pages/HobbyPage";
import ExercisePage from "../Pages/ExercisePage";
import StudyPage from "../Pages/StudyPage";

import "../App.css";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/hobby" replace />} />
        <Route path="/hobby" element={<HobbyPage />} />
        <Route path="/exercise" element={<ExercisePage />} />
        <Route path="/study" element={<StudyPage />} />
      </Route>
    </Routes>
  );
}

  