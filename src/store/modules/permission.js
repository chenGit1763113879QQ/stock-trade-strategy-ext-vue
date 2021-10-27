import {  constantRoutes } from '@/router'
import { getAuthMenu } from '@/api/user'
import Layout from '@/layout'
import router from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
 export function generaMenu(data) {
  // console.log("generaMenu",data);
  const accessedRoutes = filterAsyncRouter(data)
  return accessedRoutes
  // data.forEach(item => {
  //   // alert(JSON.stringify(item))
  //   if(item.menuType === "F") return
  //   const menu = {
  //     path: item.path === '#' ? item.id + '_key' : item.path,
  //     component: item.path === '#' ? Layout : (resolve) => require([`@/views${item.path}/index`],resolve),
  //     // hidden: true,
  //     children: [],
  //     name: 'menu_' + item.id,
  //     meta: { title: item.menuName,icon: item.icon, id: item.id, roles: ['admin'] }
  //   }
  //   if (item.children && item.menuType === "M") {
  //   // if (item.children != null && item.children && item.children.length) {
  //     // menu["redirect"] = 'noRedirect'
  //     generaMenu(menu.children, item.children)
  //   }
  //   // console.log(menu);
  //   console.log(routes);
  //   routes.push(menu)
  // })
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  // console.log(asyncRouterMap)
  // if(!asyncRouterMap) return null
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        // console.log(route.component);
        // route.component = (resolve) => require([`@/views/${route.component}`],resolve)
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }else{
      route.children = []
    }
    return true
  });

}

const loadView = (view) => {
  return (resolve) => require([`@/views/${view}/index`], resolve)
}


const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      // const loadMenuData = []
      // 先查询后台并返回左侧菜单数据并把数据添加到路由
    
      getAuthMenu(state.token).then(response => {
          let data = response.data
          // console.log("getAuthMenu:",data);
        
          // Object.assign(loadMenuData, data)
          let accessedRoutes = generaMenu(response.data)
          // console.log("accessedRoutes",accessedRoutes);
          
          // let accessedRoutes
          // if (roles.includes('admin')) {
            // alert(JSON.stringify(asyncRoutes))
            // accessedRoutes = asyncRoutes || []
          // } else {
            // accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
          // }

          // console.log(accessedRoutes);
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }

      ).catch(error => {
        console.log(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
