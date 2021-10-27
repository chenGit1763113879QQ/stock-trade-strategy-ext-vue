import request from '@/utils/request'


export function menuTreeSelectList(params) {
  return request({
    url: '/menu/menuTreeSelectList',
    method: 'get',
    params: params
  })
}

export function getMenuList(params) {
  return request({
    url: '/menu/list',
    method: 'get',
    params: params
  })
}

export function getMenuDetail(params) {
  return request({
    url: '/menu/detail',
    method: 'get',
    params: params
  })
}

export function addMenu(data) {
  return request({
    url: '/menu/save',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data
  })
}

export function deleteMenu(data) {
  return request({
    url: '/menu/delete',
    method: 'post',
    data
  })
}