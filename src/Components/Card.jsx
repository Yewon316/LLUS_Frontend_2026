function Card(props){
    return(
    <div className="card">
      <span className="card-category">{props.category}</span>
      <h3 className="card-title">{props.title}</h3>
      <p className="card-desc">{props.desc}</p>
      
      <div className="card-meta">
        <span className="card-mode">{props.mode}</span>
        <span className="card-capacity">{props.capacity}</span>
        <span className="card-schedule">{props.schedule}</span>
      </div>
    </div>

    );
}

export default Card;