import ajax from './ajax';

const BASE = 'http://106.54.249.182:5000';
export const reqLogin = (username,password) =>  ajax.post(BASE + '/login',{username,password});

// export function reqLogin(username,password){
//     return ajax({
//         method:'post',
//         url:'/login',
//         data:{
//             username,
//             password
//         }
//         // data: qs.stringify({username,password})
//     })
// }
// const username = 'admin';
// const pwd = 'admin';
// reqLogin(username,pwd).then(result => {

//     console.log("请求成功了",result);
//     if(result.status === 0){
//         console.log(0);
//     }else{
//         console.log(1);
//     }
// },error => {
//     alert("请求失败了, "+error.message)
//     console.log("请求失败了",error);
// })
