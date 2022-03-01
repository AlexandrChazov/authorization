import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import styles from "./LoginForm.module.css"

const LoginForm: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { store } = useContext(Context)

  return (
    <div className={styles.main}>
      <input
        className={styles.input}
        type="text"
        value={email}
        placeholder="Email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        className={styles.input}
        type="password"
        value={password}
        placeholder="Password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button
        onClick={() => store.login(email, password)}
        className={styles.button}
      >
        Login
      </button>
      <button
        onClick={() => store.registration(email, password)}
        className={styles.button}
      >
        Registration
      </button>
    </div>
  );
};

export default observer(LoginForm);
