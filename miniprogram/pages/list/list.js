// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [{
        text: '全部商品',
        value: 0
      },
      {
        text: '数码产品',
        value: 1
      },
      {
        text: '学习资料',
        value: 2
      },
      {
        text: '体育用品',
        value: 3
      },
      {
        text: '生活用品',
        value: 4
      }
    ],
    option2: [{
        text: '默认排序',
        value: 'updatetime'
      },
      {
        text: '热度排序',
        value: 'hits'
      },
      {
        text: '价格最低',
        value: 'price'
      },
      {
        text: '离我最近',
        value: 'location'
      }
    ],
    value1: 0,
    value2: 'updatetime',
    goodslist: [],
    searchVal: '',
    skip: 0
  },

  onChange: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.type == "op1") {
      this.setData({
        value1: Number(e.detail)
      })
    } else {
      this.setData({
        value2: e.detail
      })
    }
    this.getGoodsList('set')
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
      url: '/pages/goods/goods?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.showNavigationBarLoading()
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
    if (options.searchVal != undefined) {
      this.setData({
        searchVal: options.searchVal
      })
    }
    if (options.category != undefined) {
      this.setData({
        value1: Number(options.category) + 1
      })
    }
    this.getGoodsList('set')
  },

  //获取商品列表
  // type: add  set
  getGoodsList: function(type = 'set') {
    wx.showLoading({
      title: '加载中',
    })
    let data = {}
    if (this.data.value1 != 0) {
      data.category = Number(this.data.value1) - 1
    }
    if (this.data.searchVal != '') {
      data.title = this.data.searchVal
    }
    let skip = this.data.skip
    if (type == 'set') {
      skip = 0
    }
    data.skip = skip
    if (this.data.value2 == 'location') {
      if (this.data.latitude && this.data.longitude) {
        data.latitude = Number(this.data.latitude)
        data.longitude = Number(this.data.longitude)
      } else {
        wx.getLocation({
          type: 'wgs84',
          success(res) {
            this.setData({
              latitude: res.latitude,
              longitude: res.longitude
            })
            this.getGoodsList('set')
          }
        })
        return
      }
    } else {
      data.orderby = this.data.value2
    }

    console.log('云函数传入数据', data)
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

  //搜索框获取焦点
  onFocus: function() {
    if (this.prevent) {
      return
    }
    this.prevent = true
    setTimeout(() => {
      this.prevent = false
    }, 1000)
    wx.navigateTo({
      url: '../search/search',
    })
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
  onPullDownRefresh: function() {
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