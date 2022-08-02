import axios from 'axios';
import { ElLoading, ElMessage } from 'element-plus'
import router from '@/router/index'
let loading;
const startLoading = () => {
    loading = ElLoading.service({
        lock: true,
        text: 'loading...',
        background: 'rgba(0,0,0,0.7)'
    });
}
const endLoading = () => {
    loading.close();
}

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
})

// request interception
instance.interceptors.request.use(config => {
    // axios.interceptors.request.use(config => {
    // loading animation
    startLoading();
    // If you have a token, you need to add the token to the request header
    if (localStorage.eleToken) {
        config.headers.Authorization = localStorage.eleToken;
    }
    return config;
}, error => {
    return Promise.reject(error)
})

// Response interception
instance.interceptors.response.use(response => {
    // axios.interceptors.response.use(response => {
    // stop loading animation
    endLoading();
    return response;
}, error => {
    endLoading();

    //get error status code
    const { status } = error.response;
    // 401 redirect to login page
    if (status == 401) {
        ElMessage.error('Token is invalid, please log in again');
        // Clear expired tokens
        localStorage.removeItem('eleToken');
        // go to login page
        router.push("/login");
    } else {
        ElMessage.error(error.response.data);
    }
    ElMessage.error(error.response.data);
    return Promise.reject(error);
})


// export default axios;

export const getRequest = (url = '', params = {}, config = {}) => {
    return instance({
        method: 'get',
        url,
        params,
        ...config
    }).then(response => {
        return response
    })
}

export const postRequest = (url = '', data = {}, config = {}) => {
    return instance({
        method: 'post',
        url,
        data,
        ...config
    }).then(response => {
        return response
    })
}

export const deleteRequest = (url = '', data = {}, config = {}) => {
    return instance({
        method: 'delete',
        url,
        data,
        ...config
    }).then(response => {
        return response
    })
}

