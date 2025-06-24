
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const submitFormData = async (data) => {
    try {
        const res = await axios.post(`${baseUrl}/api/event/create`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        return res;

    } catch (error) {
        alert("Upload failed: " + error.response.data.message);
    }

}


export const getEventData = async (slug) => {
    try {
        const res = await axios.get(`${baseUrl}/api/event/${slug}`);
        return res
    } catch (error) {
        console.error("Request failed:", error);
        alert("Request failed: " + error.message);
    }
}