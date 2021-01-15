import axios from 'axios';

export function getUserList () {
    var url = 'http://localhost:8888/api/private/v1/users?pagenum=1&pagesize=5';
    return axios.get(url,{
        headers:{
            'Authorization':"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjowLCJpYXQiOjE2MDcyMzkxNzEsImV4cCI6MTYwNzMyNTU3MX0.Tp-38hqgs9SXChowTbMrg5qHyjQ0fgFX7lMKFVv58Ic"
        }
    });
}