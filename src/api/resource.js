import request from '@/utils/request'

/**
 * 资源列表
 * @param data
 * @returns {AxiosPromise}
 */
export function list(data) {
  return request({
    url: '/i-cloud-rbac/resource/list',
    method: 'post',
    data
  })
}

/**
 * 删除资源
 * @param data
 * @returns {AxiosPromise}
 */
export function del(id) {
  return request({
    url: '/i-cloud-rbac/resource/delete?id=' + id,
    method: 'delete'
  })
}

/**
 * 获取菜单资源树状结构
 * @returns {AxiosPromise}
 */
export function menuOptions() {
  return request({
    url: '/i-cloud-rbac/resource/menu_options',
    method: 'get'
  })
}

/**
 * 获取全部资源树状结构
 * @returns {AxiosPromise}
 */
export function allOptions() {
  return request({
    url: '/i-cloud-rbac/resource/all_options',
    method: 'get'
  })
}

/**
 * 添加资源
 * @param data
 * @returns {*}
 */
export function insert(data) {
  return request({
    url: '/i-cloud-rbac/resource/insert',
    method: 'post',
    data
  })
}

/**
 * 修改资源
 * @param data
 * @returns {*}
 */
export function edit(data) {
  return request({
    url: '/i-cloud-rbac/resource/update',
    method: 'put',
    data
  })
}
