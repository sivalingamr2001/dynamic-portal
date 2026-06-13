import axios from "axios";
import { ENV_CONFIG } from "./utils";

const baseURL = ENV_CONFIG.BASE_API_URL;

export const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
