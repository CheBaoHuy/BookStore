import axios, { AxiosInstance } from "axios";

type BackendApiClient = AxiosInstance & Pick<typeof axios, "isCancel">;
// chay local
// export const API_BASE_URL = ("http://localhost:8080/api").replace(/\/$/, "");
//chay deploy
export const API_BASE_URL = ("http://103.82.21.221:8080/api").replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
}) as BackendApiClient;

apiClient.isCancel = axios.isCancel;

export default apiClient;
