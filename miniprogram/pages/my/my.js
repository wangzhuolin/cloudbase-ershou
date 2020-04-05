// pages/my/my.js
let app = getApp();
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '/pages/my/user-unlogin.png',
    nickName: '未登陆',
    gender: 0
  },


  getUserInfomation: function(event) {
    console.log(event)
    this.onLoad()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: 'zh_CN',
            success: res => {
              console.log(res.userInfo)
              let {
                avatarUrl,
                city,
                nickName,
                gender,
                province
              } = res.userInfo
              avatarUrl = avatarUrl.split("/")
              avatarUrl[avatarUrl.length - 1] = 0;
              avatarUrl = avatarUrl.join('/');
              this.setData({
                avatarUrl,
                city,
                nickName,
                gender,
                province
              })
              if (!app.globalData.openid) {
                wx.cloud.callFunction({
                  name: 'login',
                  data: {},
                  success: res => {
                    console.log(res.result)
                    wx.setStorageSync('openid', res.result.openid)
                    app.globalData.openid = res.result.openid
                    db.collection('user_info').where({
                      _openid: _.eq(res.result.openid)
                    }).count({
                      success: res => {
                        console.log('查询成功', res)
                        if (res.total === 0) {
                          db.collection('user_info').add({
                            data: {
                              avatarUrl,
                              city,
                              nickName,
                              gender,
                              province
                            },
                            success: res => {
                              console.log('添加用户信息成功', res)
                            },
                            fail: err => {
                              console.log('添加用户信息失败', err)
                            }
                          })
                        } else {
                          console.log('用户已存在')
                        }
                      },
                      fail: err => {
                        console.log('查询用户信息失败', err)
                      }
                    })
                  },
                  fail: err => {
                    wx.showToast({
                      icon: 'none',
                      title: '请检查登陆状态',
                    })
                    console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
                  }
                })
              }
            }
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '单击头像即可登陆'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  }

})