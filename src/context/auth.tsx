import {createContext, useState, ReactNode, useEffect} from "react";
import { api } from "../service/axios";
import {setCookie, parseCookies} from 'nookies'
import Router from "next/router"

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SignIncredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignIncredentials):Promise<void>;
  user: User
  isAuthentcated: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProviderProps){
  const [user, setUser] = useState<User>()
  const isAuthentcated = !!user;

  useEffect(()=>{
    const {'mycrud.token': token} = parseCookies()
    if(token){
      api.get('/me').then(response => {
        const {email, permissions, roles} = response.data

        setUser({email, permissions, roles})
      })
    }
  },[])

  async function signIn({email, password}:SignIncredentials){
    try{
      const response = await api.post('sessions',{
        email,
        password
      })

      const {token, refreshToken, permissions, roles} = response.data

      setCookie(null, 'mycrud.token', token, {
        maxAge: 24 * 60 * 60 * 30, // 30 days
        path: '/'
      })
      setCookie(null, 'mycrud.refreshtoken', refreshToken, {
        maxAge: 24 * 60 * 60 * 1, // 1 day
        path: '/'
      })

      setUser({
        email,
        permissions,
        roles,
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`
      Router.push('/home')

    }catch(e){
      console.log(e)
    }
  }

  return (
    <AuthContext.Provider value={{isAuthentcated, signIn, user}}>
      {children}
    </AuthContext.Provider>
  )
}