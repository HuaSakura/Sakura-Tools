import {createRouter, createWebHashHistory, Router} from 'vue-router'

const routes: any[] = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('../view/index.vue')
    }
]

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
})


export default router
