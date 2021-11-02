import request from '@/utils/request'

export function savePlan(data) {
  return request({
    url: '/stock/tradePlan/grid/save',
    method: 'post',
    data
  })
}

export function startPlan(id) {
  return request({
    url: '/stock/tradePlan/grid/start?id='+id,
    method: 'post'
  })
}

export function stopPlan(id) {
  return request({
    url: '/stock/tradePlan/grid/stop?id='+id,
    method: 'post'
  })
}

export function deletePlan(id) {
  return request({
    url: '/stock/tradePlan/grid/delete?id='+id,
    method: 'post'
  })
}

export function getPlanList(params) {
    return request({
      url: '/stock/tradePlan/grid/list',
      method: 'get',
      params: params
    })
}


