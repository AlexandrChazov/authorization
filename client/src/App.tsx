import React, {useContext, useEffect, useState} from 'react';
import styles from './App.module.css';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";

const App: React.FC = () => {

  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers()
      setUsers(response.data)
    } catch (e: any) {
      console.log(e)
      store.setErrorMessage(e.response?.data?.message)
    }
  }

  if (store.isLoading) {
    return <div>Loading...</div>
  }

  if (!store.isAuth) {
    return (
      <div className={styles.app__wrapper}>
        <div className={styles.error__message}>{store.errorMessage}</div>
        <LoginForm/>
        <button
          className={styles.button}
          onClick={getUsers}
        >
          Get users
        </button>
      </div>
    )
  }

  return (
    <div className={styles.app__wrapper}>
      <div className={styles.error__message}>{store.errorMessage}</div>
      <h1 className={styles.text}>
        {
          store.isAuth
            ? `User "${store.user.email}" authorized `
            : 'Authorize please!'
        }
      </h1>
      <h1 className={styles.text}>
        {
          store.user.isActivated
            ? 'Account confirmed by email'
            : 'Confirm your account please!'
        }
      </h1>
      <button
        onClick={() => {
          store.logout()
          setUsers([])
        }}
        className={styles.button}
      >
        Logout
      </button>
      <button
        onClick={getUsers}
        className={styles.button}
      >
        Get users
      </button>
      {users.map(user =>
        <div
          key={user.email}
          className={styles.users__list}
        >
          {user.email}
        </div>
      )}
    </div>
  );
}

export default observer(App);
