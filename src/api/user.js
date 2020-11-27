import request from '@/utils/request'

export function info(token) {
  return request({
    url: '/i-cloud-rbac/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/i-cloud-security-auth/auth/logout',
    method: 'post'
  })
}

/**
 * 用户列表
 * @param data
 * @returns {AxiosPromise}
 */
export function list(data) {
  return request({
    url: '/i-cloud-rbac/user/list',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param data
 * @returns {AxiosPromise}
 */
export function del(id) {
  return request({
    url: '/i-cloud-rbac/user/delete?id=' + id,
    method: 'delete'
  })
}

/**
 * 添加用户
 * @param data
 * @returns {*}
 */
export function insert(data) {
  return request({
    url: '/i-cloud-rbac/user/insert',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 * @param data
 * @returns {*}
 */
export function edit(data) {
  return request({
    url: '/i-cloud-rbac/user/update',
    method: 'put',
    data
  })
}
