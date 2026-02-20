// pages/DetailStudy.jsx
import { useParams } from "react-router-dom";
import { STUDY_MEETINGS } from "../data/meetings";

export default function DetailStudy() {
  const { id } = useParams();
  const data = STUDY_MEETINGS.find((m) => m.id === id);

  if (!data) return <div className="section">정보를 찾을 수 없습니다.</div>;

  return (
    <div className="section" style={{ padding: "20px" }}>
      <h1>{data.title}</h1>
      <p>{data.desc}</p>
    </div>
  );
}