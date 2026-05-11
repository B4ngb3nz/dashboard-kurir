import axios from "axios";

const API =
 https://dashboard-api.onrender.com/api
 // "http://localhost:3001/api/dashboard";

export const getDashboard =
  async (params) => {

    const res =
      await axios.get(
        API,
        {
          params
        }
      );

    return res.data;

};