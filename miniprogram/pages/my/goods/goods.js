// pages/my/goods/goods.js
let app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist: [],
    skip: 0
  },

  onClose: function(event) {
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'right':
        wx.showModal({
          title: '提示',
          content: '确定删除吗？',
          success(res) {
            if (res.confirm) {
              db.collection('goods_list').doc(event.currentTarget.dataset.id)
                .remove({
                  success: res => {
                    wx.showToast({
                      title: '删除成功',
                    })
                    console.log('删除成功', res)
                    setTimeout(() => {
                      this.getGoodsList('set')
                    }, 2000)
                  },
                  fail: err => {
                    wx.showToast({
                      title: '删除失败',
                      icon: 'none'
                    })
                    console.log('删除失败', err)
                  }
                })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
            instance.close();
          }
        })
        break;
    }
  },
  // 跳转到详情页
  goInfo: function(e) {
    if (!e.currentTarget.dataset.id) {
      wx.showToast({
        title: '商品id不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.navigateTo({
      url: '/pages/my/goods/edit/edit?id=' + e.currentTarget.dataset.id,
    })
  },

  getGoodsList: function(type = 'set') {
    wx.showLoading({
      title: '加载中',
    })
    let data = {}
    let skip = this.data.skip
    if (type == 'set') {
      skip = 0
    }
    data.skip = skip
    data.openid = app.globalData.openid
    wx.cloud.callFunction({
      name: 'getGoodsList',
      data: data,
      success: res => {
        if (type == 'add') {
          let old_data = this.data.goodslist
          let new_data = res.result.data
          this.setData({
            goodslist: old_data.concat(new_data),
            skip: skip + res.result.data.length
          })
        } else {
          this.setData({
            goodslist: res.result.data,
            skip: skip + res.result.data.length
          })
        }
        wx.hideLoading()
        if (res.result.data.length != 0) {
          wx.showToast({
            title: '加载成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '没有数据了',
            icon: 'none'
          })
        }
        console.log("加载数据成功", res)
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
        console.log('加载数据失败', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    if (!app.globalData.openid) {
      wx.showToast({
        icon: 'none',
        title: '请登陆后查看',
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
    this.getGoodsList('set')

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideNavigationBarLoading()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getGoodsList('set')
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getGoodsList('add')
  }
})