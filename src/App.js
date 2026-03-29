import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/HomePage";
import StudyPage from "./pages/StudyPage";
import SportsPage from "./pages/SportsPage";
import HobbyPage from "./pages/HobbyPage";
import MeetingCreatePage from "./pages/MeetingCreatePage";
import MeetingDetailPage from "./pages/MeetingDetailPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/sports" element={<SportsPage />} />
        <Route path="/hobby" element={<HobbyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/meetings/:id" element={<MeetingDetailPage />} />
        <Route
          path="/meetings/new"
          element={
            <ProtectedRoute>
              <MeetingCreatePage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}