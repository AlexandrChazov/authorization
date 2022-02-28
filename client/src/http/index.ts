import axios, { AxiosRequestConfig } from "axios";
import {AuthResponse} from "../models/response/AuthResponse";

export const API_URL = "http://localhost:5000/api";

const $api = axios.create({
  withCredentials: true,      // чтобы cookie цеплялись к запросу автоматически
  baseURL: API_URL
})

$api.interceptors.request.use((config: AxiosRequestConfig) => {
    (config.headers ??= {}).Authorization = `Bearer ${localStorage.getItem("token")}`; // добавляем к запросу
return config;                                                                             // access token
})

$api.interceptors.response.use(config => config, async (error) => {
  const originalRequest = error.config;                   // сохраняем все данные запроса, который мы хотели сделать
  if (error.response.status == 401 && error.config && !error.config._isRetry) {
    originalRequest._isRetry = true            // предотвращаем зацикливание, в случае если повторный запрос
                                               // также вызовет ошибку
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
                                                // используем дефолтный "axios", так как
                                                // интерсептор, добавляющий к запросу "accessToken", здесь нам не нужен
      localStorage.setItem('token', response.data.accessToken)
      return $api.request(originalRequest)    // повторяем запрос, который хотели сделать, помним о зацикливании ._isRetry
    } catch (e) {
      console.log('User is not authorized')
    }
  }
  throw error;      // если блок if не отработал - пробрасываем ошибку на верхний уровень, ведь статус код может быть
                    // не только 401
})

export default $api;
