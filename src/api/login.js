import axios from 'axios';
const qs = require('qs');

export function checklogin (userInfo) {
            var url = 'http://localhost:8888/api/private/v1/login';
            console.log(userInfo);
            var userInfoString = qs.stringify(userInfo);
            return axios.post(url,userInfoString,{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            })
        }
