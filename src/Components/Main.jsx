import Card from "./Card";

function Main({items}){
    if(items.length === 0) {
        return <p>No items available</p>;
    }

    return(
        <div className="card-grid">
            {items.map((item, index) => (
            <Card key={index} category={item.category} title={item.title} desc={item.desc} mode={item.mode} capacity={item.capacity} schedule={item.schedule}/>
        ))}
        </div>
    );
}
export default Main;