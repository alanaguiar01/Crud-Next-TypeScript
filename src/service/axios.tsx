import axios, {AxiosError} from "axios";
import {parseCookies, setCookie} from 'nookies'
import { logOut } from "../context/auth";

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
  }, (error: any) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        // console.log(typeof erroRefresh.code);
        cookies = parseCookies();

        const { 'mycrud.refreshtoken': refreshToken } = cookies;
        const originalConfig = error.config

        if (!isRefreshing) {
          isRefreshing = true

          api.post('/refresh', {
            refreshToken,
          }).then(response => {
            const { token } = response.data;

            setCookie(null, 'mycrud.token', token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            })

            setCookie(null, 'mycrud.refreshtoken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            failRequestQueue.forEach(request => request.onSuccess(token))
            failRequestQueue = [];

          }).catch(err => {
            failRequestQueue.forEach(request => request.onFailure(err))
            failRequestQueue = [];
            console.log(err);


          }).finally(() => {
            isRefreshing = false
          });
        }

        return new Promise((resolve, reject) => {
          failRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`

              resolve(api(originalConfig))
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            }
          })
        });
      } else {
        logOut()
      }
    }

    return Promise.reject(error);
  });