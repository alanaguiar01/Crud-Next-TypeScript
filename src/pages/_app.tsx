import {AppProps} from "next/app"
import {AuthProvider} from "../context/auth"
import '../styles/global.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
