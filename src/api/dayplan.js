import request from '@/utils/request'

export function savePlan(data) {
  return request({
    url: '/stock/tradePlan/t0/save',
    method: 'post',
    data
  })
}

export function getDetail(id) {
  return request({
    url: '/stock/tradePlan/t0/detail?id='+id,
    method: 'get'
  })
}

export function startPlan(id) {
  return request({
    url: '/stock/tradePlan/t0/start?id='+id,
    method: 'post'
  })
}

export function stopPlan(id) {
  return request({
    url: '/stock/tradePlan/t0/stop?id='+id,
    method: 'post'
  })
}

export function deletePlan(id) {
  return request({
    url: '/stock/tradePlan/t0/delete?id='+id,
    method: 'post'
  })
}

export function getPlanList(params) {
    return request({
      url: '/stock/tradePlan/t0/list',
      method: 'get',
      params: params
    })
}


