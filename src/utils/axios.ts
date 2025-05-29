import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

import { authStore } from "@/app/stores/authStore";

import { ApiError } from "@/@types/api";

const axiosDefault = axios.create({
	baseURL: import.meta.env.VITE_API_ENDPOINT,
	headers: {
		"Content-Type": "application/json",
	},
});

const renewToken = async () => {
	const refreshToken = localStorage.getItem("refreshToken");

	const refreshData = await axiosDefault.post<{ accessToken: string; refreshToken: string }>(
		`/api/user/refresh`,
		{
			refreshToken: refreshToken,
		},
	);

	const newAccessToken = refreshData.data.accessToken;
	const newRefreshToken = refreshData.data.refreshToken;

	return [newAccessToken, newRefreshToken];
};

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_ENDPOINT,
	headers: {
		"Content-Type": "application/json",
	},
});

export const axiosInstanceForFiles = axios.create({
	baseURL: import.meta.env.VITE_API_ENDPOINT,
	headers: {
		"Content-Type": "multipart/form-data",
	},
});

// Request interceptor
const handleSuccessRequest = (config: InternalAxiosRequestConfig) => {
	const accessToken = localStorage.getItem("accessToken");

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
};

const handleErrorRequest = (error: unknown) => {
	return Promise.reject(error);
};

axiosInstance.interceptors.request.use(handleSuccessRequest, handleErrorRequest);
axiosInstanceForFiles.interceptors.request.use(handleSuccessRequest, handleErrorRequest);

// Response interceptor
const handleSuccessResponse = (response: AxiosResponse) => {
	return response;
};

let refreshingFunc: Promise<string[]> | undefined = undefined;

const handleErrorResponse = async (error: AxiosError<ApiError>) => {
	const originalRequest = { ...error.config };
	const { setLoggedIn } = authStore.getState();

	if (error.response?.status === 401 && originalRequest) {
		try {
			if (!refreshingFunc) refreshingFunc = renewToken();

			const [accessToken, refreshToken] = await refreshingFunc;

			if (accessToken && refreshToken) {
				localStorage.setItem("accessToken", accessToken);
				localStorage.setItem("refreshToken", refreshToken);

				originalRequest.headers!.Authorization = `Bearer ${accessToken}`;

				return await axios.request(originalRequest);
			}
		} catch (_) {
			localStorage.clear();

			setLoggedIn(false);
			return Promise.reject(error);
		} finally {
			refreshingFunc = undefined;
		}
	}

	return Promise.reject(error);
};

axiosInstance.interceptors.response.use(handleSuccessResponse, handleErrorResponse);
axiosInstanceForFiles.interceptors.response.use(handleSuccessResponse, handleErrorResponse);
