import SportsCard from "./SportsCard";
import "./SportsCard.css";


export default function SportsList({ data }) {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Current events</h2>

      <div className = "sportsGroup">
        {data.length === 0 ? (
          <p>No sports groups available.</p>
        ) : (
          data.map((item, index) => <SportsCard key={index} item={item} />)
        )}
      </div>
    </div>
  );
}