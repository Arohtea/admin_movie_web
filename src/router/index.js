import Vue from 'vue'
import VueRouter from "vue-router";
import LoginPage from '@/views/LoginPage.vue';

// import axios from 'axios';
Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            name: 'loginpage',
            path: '/loginpage',
            component: LoginPage
        },
        {
            path: '/',
            redirect: '/loginpage'
        }
    ]
})
// router.beforeEach((to, from, next) => {
//     if(to.path.startsWith('/login')){
//         window.localStorage.removeItem('jwt-token')
//         next()
//     } else {
//         let admin=JSON.parse(window.localStorage.getItem('jwt-token'))
//         if(!admin){
//             next({path:'/login'})
//         } else{
//             axios({
//                 url:'http://localhost:8080/checktoken',
//                 method:'get',
//                 headers:{
//                      Authorization:admin.token
//                 }
//             }).then((response) => {
//                 if(response.data == "fail"){
//                     console.log('校验失败')
//                     next({path : '/error'})
//                 }
//             })
//             next()
//         }
//     }
// })

export default router