import logo from '../assets/Sioux-logo.png';
import './admin-manage.css';
import Shelf from '../components/Shelf.jsx';
import React, { useEffect, useState, useRef } from "react";
import Customfooter from '../components/Footer.jsx';
import shelfAPI from "../apis/ShelfAPI.js";
import plus from "../assets/plus.png";
import Modal from "../components/modal.jsx";
import BouncyButton from "../components/MotionButton.jsx";
import ColourDropdown from '../components/Colour-dropdown.jsx';
import Room from '../components/Room.jsx';
import Delete from '../assets/delete.png'
import newroom from "../assets/newroom.png"
import Header from '../components/Header.jsx';

function AdminManage() {
    const [shelves, setShelves] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [selectedShelf, setSelectedShelf] = useState(null);

    // Form fields
    const [shelfLetter, setShelfLetter] = useState("");
    const [shelfLevels, setShelfLevels] = useState(1);
    const [levelSections, setLevelSections] = useState(1);
    const [shelfColour, setShelfColour] = useState("#FFD6A5");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [shelfToDelete, setShelfToDelete] = useState(null);

    const overlayRef = useRef(null);

    // Load rooms on start
    useEffect(() => {
        shelfAPI.getAllRooms().then((rooms) => {
            setRooms(rooms);
            if (rooms.length > 0 && !selectedRoom) {
                setSelectedRoom(rooms[0]);
            }
        });
    }, []);


    // Load shelves of active room
    useEffect(() => {
        if (!selectedRoom) return;
        shelfAPI.getAllShelves(selectedRoom.id).then(setShelves);
    }, [selectedRoom]);

    // Auto-scroll on new shelves
    useEffect(() => {
        if (shelves.length > 0) {
            requestAnimationFrame(() => {
                overlayRef.current?.scrollTo({
                    top: overlayRef.current.scrollHeight,
                    behavior: "smooth"
                });
            });
        }
    }, [shelves]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newShelf = {
            letter: shelfLetter,
            colour: shelfColour,
            levels: Array.from({ length: shelfLevels }, (_, i) => ({
                id: i + 1,
                sections: Array.from({ length: levelSections }, (_, j) => ({
                    id: j + 1,
                    isFull: false
                }))
            }))
        };

        try {
            await shelfAPI.createShelf(selectedRoom.id, newShelf);
            setShowModal(false);
            const updatedShelves = await shelfAPI.getAllShelves(selectedRoom.id);
            setShelves(updatedShelves);
        } catch (err) {
            console.error("Failed to create shelf:", err);
        }
    };

    const handleEditClick = (shelf) => {
        setSelectedShelf(shelf);
        setShelfLetter(shelf.letter);
        setShelfColour(shelf.colour);
        setShelfLevels(shelf.levels.length);
        setLevelSections(shelf.levels[0]?.sections.length || 1);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const updatedShelf = {
            id: selectedShelf.id,
            letter: shelfLetter,
            colour: shelfColour,
            levels: Array.from({ length: shelfLevels }, (_, i) => ({
                id: i + 1,
                sections: Array.from({ length: levelSections }, (_, j) => ({
                    id: j + 1,
                    isFull: false
                }))
            }))
        };

        try {
            await shelfAPI.editShelf(selectedShelf.id, updatedShelf, selectedRoom.id);
            setShowEditModal(false);
            setSelectedShelf(null);

            const updatedShelves = await shelfAPI.getAllShelves(selectedRoom.id);
            setShelves(updatedShelves);
        } catch (err) {
            console.error("Failed to edit shelf:", err);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleSelectShelfToDelete = (shelf) => {
        setShelfToDelete(shelf);
        setShowDeleteModal(false);
        setShowConfirmDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowConfirmDeleteModal(false);
        setShelfToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (! shelfToDelete) return;

        try {
            await shelfAPI.deleteShelf(shelfToDelete. id, selectedRoom.id);
            
            setShowConfirmDeleteModal(false);
            setShelfToDelete(null);

            const updatedShelves = await shelfAPI.getAllShelves(selectedRoom.id);
            setShelves(updatedShelves);
            
        } catch (err) {
            console.error("Failed to delete shelf:", err);
            
            if (err.message.includes("packages left")) {
                alert("Shelf cannot be removed: the shelf has packages");
            } else if (err.message === "Shelf not found") {
                alert("The shelf does not exist");
            } else {
                alert("Shelf cannot be removed: the shelf has packages");
            }
        }
    };

    return (
        <>
            <div className='Background'>
                <Header />
                <div className='blueBar' />

                <div className='main-field'>

                    <div className='options1'>
                        <h3 style={{color:"grey"}}>Shelf options:</h3>
                        <BouncyButton onClick={handleDeleteClick} style={{backgroundColor:"white", border:"none", boxShadow:" 0 0px 0px rgba(0, 0, 0, 0)" }}><img src={Delete} style={{ width: "97%", height: "90%", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)" }} /> </BouncyButton>
                        <BouncyButton style={{ backgroundColor: "#FF7F00", width:"48%", height:"18%" }} onClick={() => setShowModal(true)}>
                            <img src={plus} className='plus' />
                        </BouncyButton>
                    </div>
                    
                    {/* CREATE MODAL */}
                    <Modal open={showModal} onClose={() => setShowModal(false)}>
                        <div style={{ fontWeight: 'bolder', fontSize: '5vh', marginBottom: '30px', color: '#656575' }}>
                            Create new Shelf
                        </div>

                        <form onSubmit={handleSubmit} className="modal-children">
                            <div className='name-child'>
                                <label>Name:</label>
                                <input type='text' pattern=".*\S.*" value={shelfLetter} maxLength={20} required onChange={(e) => setShelfLetter(e.target.value)} />
                            </div>

                            <div className='level-child'>
                                <label>Levels:</label>
                                <input type='number' min={1} max={50} style={{width:"47%"}} value={shelfLevels} required onChange={(e) => setShelfLevels(Number(e.target.value))} />
                            </div>

                            <div className='section-child'>
                                <label>Sections per level:</label>
                                <input type='number' min={1} max={50}  style={{width:"47%"}}  value={levelSections} required onChange={(e) => setLevelSections(Number(e.target.value))} />
                            </div>

                            <div className='colour-child'>
                                <label>Colour:</label>
                                <ColourDropdown selectedColour={shelfColour} setColour={setShelfColour} />
                            </div>

                            <div className='modal-options'>
                                <BouncyButton onClick={() => setShowModal(false)} style={{ backgroundColor: '#656575' }}>Cancel</BouncyButton>
                                <BouncyButton type="submit" style={{ backgroundColor: "#FF7F00" }}>Create</BouncyButton>
                            </div>
                        </form>
                    </Modal>

                    {/* EDIT MODAL */}
                    <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
                        <div style={{ fontWeight: 'bolder', fontSize: '5vh', marginBottom: '30px', color: '#656575' }}>
                            Edit Shelf
                        </div>

                        <form onSubmit={handleEditSubmit} className="modal-children">
                            <div className='name-child'>
                                <label>Name:</label>
                                <input type='text' value={shelfLetter} maxLength={20} required onChange={(e) => setShelfLetter(e.target.value)} />
                            </div>

                            <div className='level-child'>
                                <label>Levels:</label>
                                <input type='number' min={1} value={shelfLevels} required onChange={(e) => setShelfLevels(Number(e.target.value))} />
                            </div>

                            <div className='section-child'>
                                <label>Sections per level:</label>
                                <input type='number' min={1} value={levelSections} required onChange={(e) => setLevelSections(Number(e.target.value))} />
                            </div>

                            <div className='colour-child'>
                                <label>Colour:</label>
                                <ColourDropdown selectedColour={shelfColour} setColour={setShelfColour} />
                            </div>

                            <div className='modal-options'>
                                <BouncyButton onClick={() => setShowEditModal(false)} style={{ backgroundColor: '#656575' }}>Cancel</BouncyButton>
                                <BouncyButton type="submit" style={{ backgroundColor: "#FF7F00" }}>Update</BouncyButton>
                            </div>
                        </form>
                    </Modal>
                    <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                        <div style={{ fontWeight: 'bolder', fontSize: '5vh', marginBottom: '30px', color:  '#656575' }}>
                            Select Shelf to Delete
                        </div>
                        
                        <div className='shelfcontainer-delete' style={{overflowY: 'auto', marginBottom: '5px', width:"100%", height:"80vh" }}>
                            {shelves.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#656575' }}>No shelves available</p>
                            ) : (
                                shelves.map((shelf) => (
                                    <div
                                        key={shelf.id}
                                        onClick={() => handleSelectShelfToDelete(shelf)}
                                        style={{
                                            padding: '15px',
                                            marginLeft:  '10px',
                                            marginBottom:"10px",
                                            backgroundColor: shelf.colour,
                                            borderRadius: '8px',
                                            cursor:  'pointer',
                                            display:"flex",
                                            justifyContent:"center",
                                            transition: 'transform 0.2s',
                                            fontWeight: 'bold',
                                            color: '#656575',
                                            fontSize:"150%",
                                            maxWidth:"90%"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        {shelf.letter}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className='modal-options'>
                            <BouncyButton onClick={() => setShowDeleteModal(false)} style={{ backgroundColor: '#656575' }}>Cancel</BouncyButton>
                        </div>
                    </Modal>
                    <Modal open={showConfirmDeleteModal} onClose={handleCancelDelete}>
                        <div style={{ fontWeight: 'bolder', fontSize: '5vh', marginBottom: '30px', color: '#656575' }}>
                            Confirm Delete
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <p style={{ fontSize: '2. 5vh', color: '#656575', marginBottom: '20px' }}>
                                Are you sure you want to delete the shelf: 
                            </p>
                            <p style={{ fontSize: '3vh', fontWeight: 'bold', color:  '#FF7F00' }}>
                                {shelfToDelete?.name}
                            </p>
                            <p style={{ fontSize: '2vh', color: '#d9534f', marginTop: '20px' }}>
                                This action cannot be undone! 
                            </p>
                        </div>

                        <div className='modal-options'>
                            <BouncyButton onClick={handleCancelDelete} style={{ backgroundColor: '#656575' }}>Cancel</BouncyButton>
                            <BouncyButton onClick={handleConfirmDelete} style={{ backgroundColor: '#d9534f' }}>Delete</BouncyButton>
                        </div>
                    </Modal>

                    <div className='container-manager'>
                        <div className='Manager-header'>
                            Current Room: {selectedRoom?.name || "Loading..."}
                        </div>                        
                        <div className='overlay' ref={overlayRef}>
                            <div className='ground'>
                                {shelves.map((shelf) => (
                                    <div key={shelf.id} onClick={() => handleEditClick(shelf)} style={{ cursor: "pointer" }}>
                                        <Shelf shelf={shelf} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='Manager-footer'>Click on a shelf to edit </div>
                        
                    </div>
                    <div className='options2'>
                        <div className='Room-container-admin'>
                            <h3 style={{color:"grey", marginBottom:"0", fontSize:"larger"}}>Rooms:</h3>
                            <div className='Room-selector'>
                                {rooms.map((room) => (
                                    <Room
                                        key={room.id}
                                        room={room}
                                        Submit={() => setSelectedRoom(room)}
                                    />
                                ))}
                            </div>
                        </div>
                        <BouncyButton style={{ backgroundColor: "#76DD77", width:"80%", height:"18%" }}>
                            <img style={{width:"20vw", height:"10vh"}} src={newroom} className='plus' />
                        </BouncyButton>
                    </div>

                </div>

                <Customfooter />
            </div>
        </>
    );
}

export default AdminManage;
