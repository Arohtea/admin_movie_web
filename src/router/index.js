import Vue from 'vue'
import VueRouter from "vue-router";
import LoginPage from '@/views/LoginPage.vue';
import FrontPage from '@/views/FrontPage.vue';
import CateAdd from '@/components/CateAdd.vue';
import CateDel from '@/components/CateDel.vue';
import CateUpdate from '@/components/CateUpdate.vue';
import MovieAdd from '@/components/MovieAdd.vue';
import MovieDel from '@/components/MovieDel.vue';
import MovieUpdate from '@/components/MovieUpdate.vue';
import MovieSearch from '@/components/MovieSearch.vue';

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
        },
        {
            name: 'frontpage',
            path: '/frontpage',
            component: FrontPage,
            children: [
                {
                    name: 'cateadd',
                    path: '/category/add',
                    component: CateAdd
                },
                {
                    name: 'catedel',
                    path: '/category/delete',
                    component: CateDel
                },
                {
                    name: 'cateupdate',
                    path: '/category/update',
                    component: CateUpdate
                },
                {
                    name: 'movieadd',
                    path: '/movie/add',
                    component: MovieAdd
                },
                {
                    name: 'moviedel',
                    path: '/movie/delete',
                    component: MovieDel
                },
                {
                    name: 'movieupdate',
                    path: '/movie/update',
                    component: MovieUpdate
                },
                {
                    name: 'moviesearch',
                    path: '/movie/search',
                    component: MovieSearch
                }
            ]
        }
    ]
})


export default router