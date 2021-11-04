import request from '@/utils/request'



export function queryByPage(params) {
  return request({
    url: '/notifyMsg/queryByPage',
    method: 'get',
    params: params
  })
}
