
import { useParams } from "react-router-dom";
import { STUDY_MEETINGS } from "../data/meetings";
import { useState } from "react";
import "../styles/home.css";

export default function DetailStudy() {

    const [count, setCount]= useState(0)
    const handleClick1 = () => {if (count >= data.members) {alert("Too late... This group is already full");
        return;}
       setCount(count + 1); }

    const handleClick2 = () => { if (count<=0) return;
       setCount(count - 1);}


  const { id } = useParams();
  const data = STUDY_MEETINGS.find((m) => m.id === id);
  
  return (
    <div className="section" style={{ padding: "20px" , backgroundColor:"green"}}>
      <div
      className="btn-group"
      style={{ padding: "20px", position: "relative" }}
      >
      <button 
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "8px 12px",
          background: "#eee",
          borderRadius:"6px"
          }}
           >current number of people: {count}</button>
      <h1>Title: {data.title}</h1>

      <hr/>

      <h3>Description: {data.desc}</h3>
      
        <li>Online/Offline: {data.mode}</li>
        <li>Time: {data.schedule}</li>
        <li>recruiting: {data.members}</li>
        <p></p>
      <hr/>
      </div>
      <div>
        <div className="card">
          <h3> current recruited: {count}</h3>
          <button className = "btn2" onClick={handleClick1}>join the group</button>
          <button className = "btn3" onClick={handleClick2} >leave the group</button> 
      
        </div>
      </div>
    </div>
  );
}

