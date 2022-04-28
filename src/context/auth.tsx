import {createContext, useState, ReactNode} from "react";
import { api } from "../service/axios";
import {setCookie} from 'nookies'

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
        maxAge: 24 * 60 * 60 * 30, // 30 days
        path: '/'
      })

      setUser({
        email,
        permissions,
        roles,
      })
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