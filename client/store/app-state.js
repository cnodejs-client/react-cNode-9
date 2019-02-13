import {
  observable,
  toJS,
  action,
} from 'mobx'
import { post, get } from '../util/http'


export default class AppState {
  @observable user = {
    isLogin: false,
    info: {},
    detail: {
      syncing: false,
      recent_topics: [],
      recent_replies: [],
    },
    collections: {
      syncing: false,
      list: [],
    },
  }

  // 登录
  @action login(accesstoken) {
    return new Promise((resolve, reject) => {
      post('user/login', {}, {
        accesstoken,
      }).then((resp) => {
        if (resp.success) {
          this.user.isLogin = true
          this.user.info = resp.data
          console.log(this.user);
          resolve()
        } else {
          reject(resp)
        }
      }).catch(reject)
    })
  }

  // 获取用户详情
  @action
  getUserDetail = () => {
    this.user.detail.syncing = true
    return new Promise((resolve, reject) => {
      get('user/dsying')
        .then((resp) => {
          if (resp.success) {
            this.user.detail.recent_replies = resp.data.recent_replies
            this.user.detail.recent_topics = resp.data.recent_topics
            resolve()
          } else {
            reject(resp.data.msg)
          }
          this.user.detail.syncing = false
        }).catch((err) => {
          console.log(this.user.info.loginname)
          reject(err)
          this.user.detail.syncing = false
        })
    })
  }

  // 获取收藏列表
  @action
  getCollections = () => {
    this.user.collections.syncing = true
    return new Promise((resolve, reject) => {
      get('topic_collect/dsying')
        .then((resp) => {
          if (resp.success) {
            this.user.collections.list = resp.data
            resolve()
          } else {
            reject(resp.data.msg)
          }
          this.user.collections.syncing = false
        }).catch((err) => {
          console.log(this.user.info.loginname)
          reject(err)
          this.user.collections.syncing = false
        })
    })
  }

  toJson() {
    return {
      user: toJS(this.user),
    }
  }
}
