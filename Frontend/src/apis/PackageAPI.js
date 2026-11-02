import axios from "axios";

const BASE_URL = "http://localhost:8080";

const packageAPI = {
    getPackageLocationByVerification: async (verificationCode) => {
    try {
        const response = await axios.get(
        `${BASE_URL}/packages/locate/${verificationCode}`
        );

        return response.data; // { room, shelf, level, section }
    } catch (error) {
        console.error("Error getting package location:", error);
        return null;
    }
    },

    pickupPackage: async (verification) => {
    try {
        const response = await axios.put(`${BASE_URL}/packages/pickup/${verification}`);
        return response.data;
    } catch (error) {
        console.error("Error picking up package:", error);
        throw error;
    }
    },

    deletePackageLocation: async (verification) => {
        try {
        await axios.delete(
            `${BASE_URL}/packages/location/${verification}`
        );
        } catch (error) {
        console.error("Error deleting package location:", error);
        throw error;
        }
    },
    
    // sendPackageVerificationEmail: async (packageId) => {
    //     try {
    //     await axios.post(`${BASE_URL}/packages/${packageId}/send-verification`);
    //     return true;
    //     } catch (error) {
    //     console.error("Error sending verification email:", error);
    //     return false;
    //     }
    // },
}

export default packageAPI;
