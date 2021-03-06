import router from './router';
import store from './store'
// 导入进度条跳转
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// 两个api
// NProgress.start() // 启动进度条
// NProgress.done()  // 进度条结束
// 白名单数组 白名单: 不需要token就可直接访问的页面
const whiteList = ['/login', '/404']
router.beforeEach(async (to, form, next) => {
  // 获取token
  // console.log(store)
  // 启动进度条
  NProgress.start()
  const token = store.state.user.token
  // 判断是否有token 
  if(token) {
    // 如果有token 
    // 是否去登录页
    if(whiteList.includes(to.path)) {
      // 是就放行到主页
      next('/')
      // console.log('你已经登录,不能返回登录页')
      
      NProgress.done()
    } else {
      // 判断是否有个人信息
      const userInfo = store.state.user.userInfo
      if(!userInfo.userId) {
        // 如果没有个人信息就获取,有就放行
        // 发请求拿信息,调用action
        await store.dispatch('user/getProfile')
      }
      next()
    }
  } else {
    // 没有token
    // 去的页面是否是白名单
    if(whiteList.includes(to.path)) {
      // 是 放行
      console.log('没有token')
      next()
      NProgress.done()
    } else {
      // 否,去登录页
      next('/login')
    }
  }
  // console.log('去', to.path)
  // console.log('来自', form.path)
  // next()
})
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
  console.log()
})
// import { Message } from 'element-ui'
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

