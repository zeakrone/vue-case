import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect:'/Home'
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../views/Home/index.vue'),
    children:[
      {path:'/user/list',name:"list",component: () => import('../views/user/list.vue')},
      {path:'/power/list',name:"list",component: () => import('../views/power/list.vue')},
      {path:'/power/role',name:"role",component: () => import('../views/power/role.vue')},
      {path:'/goods/list',name:"list",component: () => import('../views/goods/list.vue')},
      {path:'/goods/add',name:"add",component: () => import('../views/goods/add.vue')},
      {path:'/goods/params',name:"params",component: () => import('../views/goods/params.vue')},
      {path:'/goods/sort',name:"sort",component: () => import('../views/goods/sort.vue')},
      {path:'/order/list',name:"list",component: () => import('../views/order/list.vue')},
      {path:'/data/list',name:"list",component: () => import('../views/data/list.vue')},

    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login/index.vue')
  },
  // {
  //   path: '/goods/sort1',
  //   name: 'Home',
  //   component: () => import('../views/goods/sort1.vue')
  // },
]

const router = new VueRouter({
  routes
})

// 设置路由守卫
router.beforeEach((to, from, next) => {
  // console.log("to",to);
  // console.log("from",from);
  if(to.path !== '/login' && !localStorage.getItem("token")){
    next('/login');
    return;
  }else if (to.path === '/login' && localStorage.getItem("token")){
    next(from.path);
    return;
  }else{
    next();
  }
})

export default router
