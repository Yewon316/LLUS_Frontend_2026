import { useState } from "react"
import { useNavigate } from "react-router-dom";


export default function CreatePage({onCreate}){
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCard = {
            id: Date.now(), 
            title: title,
            desc: desc,
            category: "Study",
        };
        onCreate(newCard);
        navigate("/study");
    };

    return (
        <div className="section">
      <h2>Create new study</h2>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Enter title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
         <hr/>
        <textarea 
          placeholder="Enter description" 
          value={desc} 
          onChange={(e) => setDesc(e.target.value)} 
          required 
        />
        <hr/>
        <button type="submit">create study </button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
    
    };