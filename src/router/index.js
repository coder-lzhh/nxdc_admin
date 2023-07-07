import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../components/Login.vue') },
  {
    path: '/home', component: () => import('../components/Home.vue'),
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: () => import('../components/Welcome.vue') },
      { path: '/storeInfo', component: () => import('../components/store/StoreInfo.vue') },
      { path: '/evaluate', component: () => import('../components/store/Evaluate.vue') },
      { path: '/userlist', component: () => import('../components/user/UserList.vue') },
      { path: '/orderlist', component: () => import('../components/order/OrderList.vue') },
      { path: '/goodslist', component: () => import('../components/goods/GoodsList.vue') },
      { path: '/goodsclassify', component: () => import('../components/goods/GoodsClassify.vue') },
      { path: '/propertylist', component: () => import('../components/goods/PropertyList.vue') },
      { path: '/data', component: () => import('../components/data/Data.vue') },
      { path: '/couponlist', component: () => import('../components/coupon/CouponList.vue') },
  

    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {

  if (to.path === '/login') return next()

  const token = window.localStorage.getItem('ADMIN_TOKEN')
  if (!token) return next("/login")

  next()

})

export default router
