
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useState } from "react"; 

import HomePage from "./pages/HomePage";
import StudyPage from "./pages/StudyPage";
import DetailStudy from "./pages/DetailStudy";
import ProjectPage from "./pages/ProjectPage";
import SportsPage from "./pages/SportsPage";
import HobbyPage from "./pages/HobbyPage";
import { STUDY_MEETINGS } from "./data/meetings"; 
import CreatePage from "./pages/CreatePage"; 

export default function App() {

const [meetings, setMeetings] = useState(STUDY_MEETINGS); 
const handleCreate = (newCard) => { 
  setMeetings([newCard, ...meetings]);
}
const handleDelete = (id) => {
  setMeetings(meetings.filter(m => m.id !== id));
}
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/study" element={<StudyPage meetings = {meetings} onDelete={handleDelete} />} />
        <Route path="/study/:id" element={<DetailStudy />} /> 
        <Route path="/create" element={<CreatePage onCreate={handleCreate} />} /> 
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/sports" element={<SportsPage />} />
        <Route path="/hobby" element={<HobbyPage />} />
      </Route>
    </Routes>
  );
}
