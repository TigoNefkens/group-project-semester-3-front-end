import "./Shelf.css";
import Level from "./Level";

export default function Shelf({ shelf }) {

    const shelfColor = shelf.colour;
    const sortedLevels = [...shelf.levels].sort((a, b) => b.id - a.id);

    return (
        <>
            <div className='levelcontainer'>
                {sortedLevels.map((level) => (<Level key={level.id} level={level} color={shelfColor}/>))}
                <div className="shelfLabel" style={{color: "#656575"}}>{shelf.letter}</div>
            </div>
        </>
    )
}