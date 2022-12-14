import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Index from '../views/Index.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
import InfoShow from '../views/InfoShow.vue'
import FundList from '../views/FundList.vue'
const routes = [
  {
    path: '/',
    redirect: '/index'
    
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    children:[
      {path:'', component:Home},
      {path:'home',name:'home' ,component:Home},
      {path:'infoshow',name:'infoshow' ,component:InfoShow},
      {path:'fundlist',name:'fundlist',component:FundList}
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },{
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/:pathMatch(.*)',
    name: '/404',
    component: NotFound
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
//
router.beforeEach((to,from,next) => {
const isLogin = localStorage.eleToken ? true : false;
if(to.path =="/login"|| to.path=="/register"){
  next();
}else{
  isLogin ? next(): next('/login');
}
})
export default router
