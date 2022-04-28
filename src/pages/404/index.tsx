import React from "react";
import { useRouter } from 'next/router'

export default function Page404(){
  const router = useRouter()
  return (
    <>
      <h1>Page Not Found: Error 404.</h1>
      <p>volte para a pagina inicial</p>
      <button onClick={
        () => router.push('/')} >
        Voltar
      </button>
    </>
  )
}