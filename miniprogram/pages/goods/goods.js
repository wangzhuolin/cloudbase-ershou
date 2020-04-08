// pages/goods/goods.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    islike: false
  },

  onClickCollect: function() {
    if (!app.globalData.openid) {
      wx.showToast({
        icon: 'none',
        title: '请先登陆',
        complete: res => {
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/my/my',
            })
          }, 2000);
        }
      })
      return
    }
    const db = wx.cloud.database()
    const _ = db.command
    if (this.data.islike) {
      wx.showModal({
        title: '提示',
        content: '确定取消收藏?',
        success: res => {
          if (res.confirm) {
            db.collection('favorites_list').where({
              _openid: _.eq(app.globalData.openid),
              goodsid: this.data.id
            }).remove({
              success: res => {
                this.setData({
                  islike: false
                })
                wx.showToast({
                  title: '取消收藏成功',
                  icon: 'success'
                })
                console.log("收藏成功", res)
              },
              fail: err => {
                wx.showToast({
                  title: '取消收藏失败',
                  icon: 'none'
                })
                console.log(err)
              }
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else(
      db.collection('favorites_list').add({
        data: {
          goodsid: this.data.id,
          time: db.serverDate()
        },
        success: res => {
          this.setData({
            islike: true
          })
          wx.showToast({
            title: '收藏成功',
            icon: 'success'
          })
          console.log("收藏成功", res)
        },
        fail: err => {
          wx.showToast({
            title: '收藏失败',
            icon: 'none'
          })
          console.log(err)
        }
      })
    )


    console.log('收藏');

  },

  onClickButton(e) {
    console.log(e);
    wx.showModal({
      title: this.data.info.userinfo[0].nickName + '的联系方式',
      content: this.data.info.tel,
      confirmText: '复制',
      success: res => {
        if (res.confirm) {
          wx.setClipboardData({
            data: this.data.info.tel,
            success: res => {
              console.log('复制成功', res) // data
            }
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  imgYu: function(event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = this.data.info.imglist; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)

    wx.showLoading({
      title: '数据加载中',
    });
    wx.cloud.callFunction({
      name: 'getGoodsInfo',
      data: {
        id: options.id
      },
      success: res => {
        console.log(res.result.list[0].favorites.length)
        let islike = res.result.list[0].favorites.length != 0 ? true : false
        this.setData({
          info: res.result.list[0],
          id: options.id,
          islike: islike
        })
        wx.hideLoading()
        wx.showToast({
          title: '加载成功',
          icon: 'success'
        })
        console.log("获取成功", res)
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
        console.log(err)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.info.title,
      path: '/pages/goods/goods?id=' + this.data.id,
      imageUrl: this.data.info.thumb
    }
  }
})