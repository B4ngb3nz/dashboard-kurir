import axios from "axios";

const API =
  "http://localhost:3001/api/dashboard";

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