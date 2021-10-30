import request from '@/utils/request'

export function saveCompose(data) {
  return request({
    url: '/compose/add',
    method: 'post',
    data
  })
}


export function deleteCompose(data) {
    return request({
      url: '/compose/delete',
      method: 'post',
      data
    })
}

export function getDataList(params) {
    return request({
      url: '/compose/queryByPage',
      method: 'get',
      params: params
    })
}

export function getDetail(params) {
    return request({
      url: '/compose/detail',
      method: 'get',
      params: params
    })
}