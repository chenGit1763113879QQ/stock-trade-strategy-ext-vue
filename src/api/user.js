import request from '@/utils/request'
import requestForm from '@/utils/request-form'

export function login(data) {
  return requestForm({
    url: '/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}



export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}


export function getAuthMenu(token) {
  return request({
    url: '/user/getRouters',
    method: 'get',
    params: { token }
  })
}

export function getUserListByRoleId(params) {
  return request({
    url: '/user/listByRoleId',
    method: 'get',
    params: params
  })
}

export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params: params
  })
}

export function getUserDetail(params) {
  return request({
    url: '/user/detail',
    method: 'get',
    params: params
  })
}

export function saveUser(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: '/user/resetPassword',
    method: 'post',
    data
  })
}

export function updateEmail(data) {
  return request({
    url: '/user/updateEmail',
    method: 'post',
    data
  })
}

export function updateAvatar(data) {
  return request({
    url: '/user/updateAvatar',
    method: 'post',
    data
  })
}


export function enableOrDisableUser(data) {
  return request({
    url: '/user/enableOrDisableUser',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: `/user/delete`,
    method: 'post',
    data
  })
}
