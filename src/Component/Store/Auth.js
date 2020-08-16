import { data } from './localStorage';
import { Loginstatus } from './LoginCheck/LoginCheck';
import axios from 'axios';

const authSuccess = (userId, content) => {
    return {
        type: 'AUTH_SUCCESS',
        userId: userId,
        content: content
    };
};

const authFail = (error) => {
    return {
        type: 'AUTH_FAIL',
        error: error,
    };
};


export const auth = (user, password, isSignup) => {
    const authData = new Object();
    authData.userName = user;
    authData.password = password;
    authData.existUser = false;
    authData.id = ''
    const checkStorage = localStorage
    var reg = /^\+?[0-9][0-9]*$/;
    // -------------------------------------------------Only front - end -----------------------------------------------------------------------
    //It needs to clear the storage first when everytime switch to this App.....
    // 这种方法仅适用于。。当userId获取到cookie以后。。在同一个域名下。。会存储多个user。。。
    // 这个之后再做。
    for (let key in checkStorage) {
        console.log('now it starts to check the exist user....')
        console.log(reg.test(Number(key.split('_')[0])))
        if (reg.test(Number(key.split('_')[0]))) {
            if (data.get(key).user === authData.userName) {
                authData.existUser = true;
                authData.id = key
            }

        }

        console.log(authData)
        console.log("whether this user has already existed:", authData.existUser)
        //没事，，错了就要改正，否则永远都是错的。。糊弄自己就等于糊弄自己的人生、。、、、、
        if (isSignup) {
            const url_signup = 'http://localhost:8080/api/user/signup';

            console.log('开始向后端发起signup请求了')
            return axios.post(url_signup, JSON.stringify(authData)).then(response => {
                console.log(response.data)
                if (response.data.errno === 1) {
                    return authSuccess('xxx', response.data.message)
                }
                return authFail(response.data.message)
            }).catch(err => {
                authFail(err)
            });
        }
        else {
            if (authData.password === '') {
                return authFail('The password is required')
            } if (authData.userName === '') {
                return authFail('The username is required')
            }
            const url_login = 'http://localhost:8080/api/user/login';
            return axios.post(url_login, JSON.stringify(authData)).then(response => {
                console.log(response.data)
                if (response.data.errno) {
                    if (!authData.existUser) {
                        console.log('The user dont have history of loggin in this app!!~!')
                        const userId = `${Date.now()}_${Math.random()}`
                        data.set('currentUser', userId)
                        data.set(userId, { user: authData.userName })
                        Loginstatus(authSuccess(userId, response.data.data))
                        return authSuccess(userId, response.data.data)
                    }

                    console.log('The user has the history of loggin in this app!')
                    data.set('currentUser', authData.id)
                    Loginstatus(authSuccess(authData.id, response.data.data))
                    return authSuccess(authData.id, response.data.data)
                }
                return authFail(response.data.message)
            }).catch(err => {
                authFail(err)
            });
        }
    }
}

// ----------------------------------------------------------If have back-end server--------------------------------------------------------------------------------

//     let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCA09BIX4hedS0NTjmoC2oaQ_CmD8KWIA4';
//     if (!isSignup) {
//         // url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCA09BIX4hedS0NTjmoC2oaQ_CmD8KWIA4';
//         url = configuration.api.backend_api + "/api/v1/users/signIn";
//     }



