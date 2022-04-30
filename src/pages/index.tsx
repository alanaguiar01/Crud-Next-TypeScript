import React, {useContext, useState} from "react";
import {AuthContext} from '../context/auth'
import styles from '../styles/pages/index.module.scss';

export default function Login(){
  const {signIn} = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(){
    const data = {
      email,
      password
    }
    await signIn(data)
  }

  return (
  <>
      <div className={styles.form}>
        <h1 className={styles.title}>Accesses your Account</h1>
        <div className={styles.input}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder = "Enter your email"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder = "Enter your password"
          />
        </div>
        <button onClick={handleSubmit}>Login</button>
        <p>Do you want to register?</p>
        <p>SingUp</p>
      </div>

  </>

  )
}
