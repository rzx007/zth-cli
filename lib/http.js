
// 通过 axios 处理请求
const axios = require('axios')
require('https').globalAgent.options.rejectUnauthorized = false

axios.interceptors.request.use(
  config => {
    // config.headers.Authorization = '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'
    return config
  },
  error => {
    // eslint-disable-next-line no-console
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(res => {
  return res.data;
})


/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoList() {
  return axios.get('https://api.github.com/orgs/zth-cli/repos')
}

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function  getTagList(repo) {
  return axios.get(`https://api.github.com/repos/zth-cli/${repo}/tags`)
}
module.exports = {
  getRepoList,
  getTagList
}
