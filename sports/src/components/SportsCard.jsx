import "./SportsCard.css";

export default function SportsCard({ item }) {
  return (
    <div className="card-container">
      <p className="item-type">{item.type}</p>
      
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      
      <p className="item-info location-text">
         {item.location}
      </p>
      <p className="item-info">
         {item.people} people
      </p>

      <div className="tag-container">
        {item.tags.map((tag, i) => (
          <span key={i} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}