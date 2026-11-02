
import logo from '../assets/Sioux-logo.png';
import footer from '../assets/footer.png';
import './receptionist-inventory-quantity.css'
import Shelf from '../components/Shelf.jsx'
import React, { useEffect, useState, useRef } from "react";
import Customfooter from '../components/Footer.jsx';
import shelfAPI from "../apis/ShelfAPI.js";
import Room from '../components/Room.jsx';
import { color } from 'framer-motion';
import Header from '../components/Header.jsx';

function receptionist_inventory_quantity() {
    const [shelves, setShelves] = useState([])
    const [roomId, setRoomId] = useState(1);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        if (selectedRoom) {
            shelfAPI.getAllShelves(selectedRoom.id).then(setShelves);
        }
    }, [selectedRoom]);
    const overlayRef = useRef(null);

    useEffect(() => {
        shelfAPI.getAllRooms().then((rooms) => {
            setRooms(rooms);
            if (rooms.length > 0) {
            setSelectedRoom(rooms[0]);
            }
        });
    }, []);

    const handleRoomChange = (room) => {
        setSelectedRoom(room);
    };
        
    useEffect(() => {
    if (shelves.length > 0) {
        requestAnimationFrame(() => {
            overlayRef.current?.scrollTo({
                top: overlayRef.current.scrollHeight,
                behavior: "smooth",
            });
        });
    }
    }, [shelves]);

    return (
        <>
            <div className='Background'>
                <Header />
                <div className='blueBar'/>
                <div className='main-rep'>
                    <div className='container-rep' >
                    <div className='Manager-header'>Current Room : {selectedRoom?.name || "Loading..."}</div>
                    <div className='overlay' ref={overlayRef}>
                        
                        <div className='ground'>
                            <div className='ground'>
                                {shelves.length > 0 ? (shelves.map((shelf) => (<Shelf key={shelf.id} shelf={shelf} />))) : (<p style={{color:"black", fontWeight:"bold", fontSize:"50px", marginLeft:"300px"}}>No storage data available</p>)}
                            </div>
                        </div>
                    </div>
                    <div className='Manager-footer' style={{color:"#EDEDED"}}>.</div>
                    </div>
                    
                    <div className='Room-container'>
                        <h3 style={{color:"grey", margin:"0"}}>Rooms:</h3>
                        <div className='Room-selector'>
                            {rooms.map((room) => (
                                <Room
                                key={room.id}
                                room={room}
                                Submit={() => handleRoomChange(room)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <Customfooter></Customfooter>
            </div>
        </>
    )
}

export default receptionist_inventory_quantity