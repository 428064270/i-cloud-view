import request from '@/utils/request'

/**
 * 角色列表
 * @param data
 * @returns {AxiosPromise}
 */
export function list(data) {
  return request({
    url: '/i-cloud-rbac/role/list',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 * @param data
 * @returns {AxiosPromise}
 */
export function del(id) {
  return request({
    url: '/i-cloud-rbac/role/delete?id=' + id,
    method: 'delete'
  })
}

/**
 * 添加资源
 * @param data
 * @returns {*}
 */
export function insert(data) {
  return request({
    url: '/i-cloud-rbac/role/insert',
    method: 'post',
    data
  })
}

/**
 * 修改角色
 * @param data
 * @returns {*}
 */
export function edit(data) {
  return request({
    url: '/i-cloud-rbac/role/update',
    method: 'put',
    data
  })
}

/**
 * 获取全部资源树状结构
 * @returns {AxiosPromise}
 */
export function allOptions() {
  return request({
    url: '/i-cloud-rbac/role/all_options',
    method: 'get'
  })
}
