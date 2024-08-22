import axios from 'axios'

let url: any;

url = "http://"+ localStorage.getItem('ipAddr') + ":" + localStorage.getItem('port')

const request = axios.create({
    baseURL: url,
    timeout: 100000
})
request.interceptors.request.use((config) => {
        return config
    }, (error) => {
        Promise.reject(error)
    }
)
request.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default request
