import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
import axios from "axios";

export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = false;
  errorMessage = "";

  constructor() {
    makeAutoObservable(this)  // применить автоматические настройки mobx
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  clearErrorMessage() {
    this.errorMessage = ""
  }

  setErrorMessage(message: string) {
    this.errorMessage = message
    setTimeout(() => {
      this.clearErrorMessage();
    }, 3000)
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response)
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message)  // в бекенде я сохранял ошибки в "res", в поле "message"
      this.setErrorMessage(e.response?.data?.message)
    }
  }

  async registration(email: string, password: string) {
    try {
      const response = await AuthService.registration(email, password);
      console.log(response)
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message)  // в бекенде я сохранял ошибки в "res", в поле "message"
      this.setErrorMessage(e.response?.data?.message)
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e: any) {
      console.log(e.response?.data?.message)  // в бекенде я сохранял ошибки в "res", в поле "message"
      this.setErrorMessage(e.response?.data?.message)
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
                                          // используем дефолтный "axios", так как
                                          // интерсептор, добавляющий к запросу "accessToken", здесь нам не нужен
      console.log(response)
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch(e: any) {
      console.log(e.response?.data?.message)  // в бекенде я сохранял ошибки в "res", в поле "message"
      this.setErrorMessage(e.response?.data?.message)
    } finally {
      this.setLoading(false);
    }
  }
}
