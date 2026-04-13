
import axios from "axios";

const API = axios.create({
  baseURL: "https://api.villageapi.com/v1",
  headers: {
    "X-API-Key": "your_api_key_here"
  }
});

export default API;