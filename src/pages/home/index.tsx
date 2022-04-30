import {useContext, useEffect} from "react"
import { api } from "../../service/axios"
import {AuthContext} from "../../context/auth"

export default function Home(){
  const {user} = useContext(AuthContext)

  useEffect(() =>{
    api.get('/me').then(response => console.log(response))
  },[])

    return (
        <h1>Hello World!: {user?.email}</h1>
    )
}