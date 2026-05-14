import axios from "axios";

const  API_URL =
"https://dashboard-api.onrender.com/api/dashboard";

 // "http://localhost:3001/api/dashboard";

export const getDashboard =
  async (params) => {

    const res =
      await axios.get(
        API_URL,
        {
          params
        }
      );

    return res.data;

};