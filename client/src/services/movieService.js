import axios from "axios";

const API_URL =`${import.meta.env.VITE_API_URL}/movies`;

export const getMovies = async (params = {}) => {
    const response = await axios.get(API_URL, {
        params,
    });

    return response.data;
};

export const getMovieById = async (id) => {
    const response = await axios.get(
        `${API_URL}/${id}`
    );

    return response.data;
};

export const getWatchVideo = async (id) => {
    const token =
        localStorage.getItem("accessToken");

    const response = await axios.get(
        `${API_URL}/${id}/watch`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};