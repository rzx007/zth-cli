
// 通过 axios 处理请求
const axios = require('axios')

axios.interceptors.request.use(
  config => {
    config.headers.Authorization = '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'
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
  return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function  getTagList(repo) {
  return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}

module.exports = {
  getRepoList,
  getTagList
}
