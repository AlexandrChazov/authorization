import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";

export default class Store {
  user = {} as IUser;
  isAuth = false;

  constructor() {
    makeAutoObservable(this)  // применить автоматические настройки mobx
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
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
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e: any) {
      console.log(e.response?.data?.message)  // в бекенде я сохранял ошибки в "res", в поле "message"
    }
  }
}
