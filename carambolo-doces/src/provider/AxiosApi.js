import axios from "axios"

export const axiosApi = axios.create(
    {
        baseURL: "http://20.172.70.84:8080",
        headers: {
            "Content-Type": "application/json"
        }
    }
)