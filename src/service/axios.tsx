import axios, {AxiosError} from "axios";
import {parseCookies, setCookie} from 'nookies'

let cookies = parseCookies()
let isRefreshing = false
let failRequestQueue = []

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['mycrud.token']}`
  }
})


api.interceptors.response.use(response => {
  return response
  }, (error: AxiosError) => {
    if(error.response.status === 401){
      if(error.response.data['code'] === 'token.expired'){
        // refresh token

        cookies = parseCookies()

        const {'mycrud.refreshToken': refreshToken} = cookies
        const originalConfig = error.config

        if(!isRefreshing){

          isRefreshing = true

          api.post('/refresh', {
            refreshToken,
          }).then(response => {
            const {token} = response.data

            setCookie(null, 'mycrud.token', token, {
              maxAge: 24 * 60 * 60 * 30, // 30 days
              path: '/'
            })
            setCookie(null, 'mycrud.refreshtoken', response.data.refreshToken, {
              maxAge: 24 * 60 * 60 * 1, // 1 day
              path: '/'
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            failRequestQueue.forEach(request => request.success(token))
            failRequestQueue = []

          }).catch(err => {failRequestQueue.forEach(request => request.onFailure(err))
            failRequestQueue = []

          }).finally(() => {
            isRefreshing = false
          })

        }
          return new Promise((resolve, reject) => {
            failRequestQueue.push({
              success: (token: string) => {
                originalConfig.headers['Authorization'] = `Bearer ${token}`


                resolve(api(originalConfig))
              },
              onFailure: (err: AxiosError) => {
                reject(err)
              }
            })
          })
      }else{
        //make logout
      }
    }
})