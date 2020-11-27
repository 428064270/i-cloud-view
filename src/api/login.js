import request from '@/utils/request'

/**
 * 获取图形验证码
 * @returns {AxiosPromise}
 */
export function getCode() {
  return request({
    url: '/i-cloud-security-auth/auth/code',
    method: 'get'
  })
}

/**
 * 登录
 * @param data
 * @returns {AxiosPromise}
 */
export function login(data) {
  return request({
    url: '/i-cloud-security-auth/login',
    method: 'post',
    data
  })
}
