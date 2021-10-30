import request from '@/utils/request'

export function tradeStockItem(data) {
  return request({
    url: '/compose/stock/action/trade',
    method: 'post',
    data
  })
}

export function getStockList(params) {
    return request({
      url: '/compose/stock/item/list',
      method: 'get',
      params: params
    })
}

export function searchStock(params) {
    return request({
      url: '/stock/common/queryPageByKey',
      method: 'get',
      params: params
    })
}

export function queryStockActionList(params) {
    return request({
      url: '/compose/stock/action/queryByPage',
      method: 'get',
      params: params
    })
}

