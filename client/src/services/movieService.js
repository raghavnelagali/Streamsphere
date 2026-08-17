import api from "./api";

export const getMovies = async (params = {}) => {
    const response = await api.get(
        "/movies",
        {
            params,
        }
    );

    return response.data;
};

export const getMovieById = async (id) => {
    const response = await api.get(
        `/movies/${id}`
    );

    return response.data;
};

export const getWatchVideo = async (id) => {
    const token =
        localStorage.getItem("accessToken");

    const response = await api.get(
        `/movies/${id}/watch`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};