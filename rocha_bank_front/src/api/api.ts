import axios, { AxiosInstance } from "axios";

const api = (bearerToken: string): AxiosInstance => {
    const api = axios.create({
        baseURL: "https://localhost:7029/",
        headers: {
            Authorization: `bearer ${bearerToken}`
        }
    })

    api.defaults.withCredentials = true;
    return api
}

export { api}