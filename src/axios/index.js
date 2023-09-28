import axios from 'axios'
import { toast } from 'react-toastify';

// const LOCAL_API_URL = 'http://127.0.0.1:8000/api/v1/'
const LOCAL_API_URL = 'http://crg-co2-21-0079:8000/api/v1/'
const HOSTED_API_URL = ''
const CURRENT_API_URL = LOCAL_API_URL

const instance = axios.create({
    baseURL: CURRENT_API_URL
})

instance.interceptors.response.use(function (response) {
    return response
}, function (error) {
    if (error?.message == 'Network Error') {
        toast.error('Network error')
        return
    }
    if (error?.response?.status === 401) {
        toast.error('Session expired')
        window.location = '/auth/login'
        return
    }
    if (error?.response?.status === 400) {
        toast.error('Error 400')
        return
    }

    return Promise.reject(error)
});

export { CURRENT_API_URL }
export default instance