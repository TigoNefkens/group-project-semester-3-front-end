import axios from "axios";
import ShelfModel from "../models/shelfModel.js";
import LevelModel from "../models/levelModel.js";
import SectionModel from "../models/sectionModel.js";
import LocationModel from "../models/locationModel.js";
import roomModel from "../models/roomModel.js";


const BASE_URL = "http://localhost:8080";

const shelfAPI = {
  getAllShelves: async (roomId) => {
    try {
      const response = await axios.get(`${BASE_URL}/Shelves/rooms/${roomId}/shelves`);
      const data = response.data;

 
      const shelves = data.map(shelf => new ShelfModel(shelf.id,shelf.letter,shelf.colour,(shelf.levels || []).map(level =>new LevelModel(level.id,(level.sections || []).map(section => new SectionModel(section.id, section.isFull))))));
      return shelves;

    } catch (error) {
      console.error("Error getting the shelves:", error);
      return []; 
    }
  },
  
  getAllSections: async () => {
    const response = await axios.get(`${BASE_URL}/packages/locations`);

    if (response.status !== 200) {
      throw new Error("Backend responded with status " + response.status);
    }

    const data = response.data;

    return data.map(loc => 
      new LocationModel(
        loc.location_id,
        loc.room,
        loc.shelf,
        loc.level,
        loc.section
      )
    );
  },

  getAllRooms: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Shelves/rooms`);
      const data = response.data;

      return data.map(room => 
        new roomModel(
          room.id,
          room.name,
      )
    );

    } catch (error) {
      console.error("Error getting the sections:", error);
      return [];
    }
  },

  editShelf: async (shelfId, shelfData, roomId) => {
    try {
      const response = await axios.put(`${BASE_URL}/Shelves/${roomId}/${shelfId}`, shelfData);
      console.log("Shelf edited successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error editing shelf:", error);
      throw error;
    }
  },

  createShelf: async (roomId, shelfData) => {
    try {
      const response = await axios.post(`${BASE_URL}/Shelves/shelves/${roomId}`, shelfData);
      console.log("Shelf created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating shelf:", error);
      throw error;
    }
  },

  deleteShelf: async (shelfId, roomId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/Shelves/${roomId}/${shelfId}`);
      console.log("Shelf deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.error("Shelf not found");
          throw new Error("Shelf not found");
        } else if (error.response.status === 500) {
          const errorMessage = error.response.data || "Cannot delete shelf";
          console.error("Server error:", errorMessage);
          throw new Error(errorMessage);
        }
      }
      console.error("Error deleting shelf:", error);
      throw error;
    }
  },

  updateSectionFullStatus: async (roomNumber, shelfName, levelId, sectionId, isFull) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/Shelves/rooms/${roomNumber}/shelves/${shelfName}/levels/${levelId}/sections/${sectionId}?isFull=${isFull}`,
        { method: "PATCH" }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating section:", error);
      throw error;
    }
  },
};

export default shelfAPI;