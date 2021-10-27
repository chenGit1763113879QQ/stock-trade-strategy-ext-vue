import request from '@/utils/request'



export function getRoles(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params: params
  })
}

export function getAllRoles() {
  return request({
    url: '/role/listAll',
    method: 'get'
  })
}

export function getRoleDetail(params) {
  return request({
    url: '/role/detail',
    method: 'get',
    params: params
  })
}

export function saveRole(data) {
  return request({
    url: '/role/save',
    method: 'post',
    data
  })
}

export function enableOrDisableRole(data) {
  return request({
    url: '/role/enableOrDisableRole',
    method: 'post',
    data
  })
}

// export function updateRole(id, data) {
//   return request({
//     url: `/role/update/${id}`,
//     method: 'post',
//     data
//   })
// }

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'post'
  })
}


export function userRoleAuthorize(data) {
  return request({
    url: `/role/userRoleAuthorize`,
    method: 'post',
    data
  })
}

export function unAuthorizeUserList(params) {
  return request({
    url: '/role/unAuthorizeUserList',
    method: 'get',
    params: params
  })
}