//index.js
const app = getApp()

Page({
  data: {
    background: [
      'https://6572-ershou-1301498416.tcb.qcloud.la/swiper/v2_q7xxx7.jpg?sign=88c88fcc8e5536cfcc779be77ff4f632&t=1586139879',
      'https://6572-ershou-1301498416.tcb.qcloud.la/swiper/v2_q7xxzy.jpg?sign=e4ae58b410be555a7ab5bd518d2d77ee&t=1586139909'
    ],
    tab: [{
      name: "最近发布",
      content: []
    }, {
      name: "热门商品",
      content: []
    }],
    grid: [{
        imgurl: '/images/category/1.jpg',
        name: '数码产品',
        url: '../list/list?category=0'
      },
      {
        imgurl: '/images/category/2.jpg',
        name: '学习资料',
        url: '../list/list?category=1'
      },
      {
        imgurl: '/images/category/3.jpg',
        name: '体育用品',
        url: '../list/list?category=2'
      },
      {
        imgurl: '/images/category/4.jpg',
        name: '全部',
        url: '../list/list'
      }
    ],
    active: 0,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    tabbar: {},
    skip: 0
  },

  onChange: function(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none'
    });
  },
  //切换分类
  switchType: function(e) {
    console.log('切换标签', e.detail)
    // this.getGoodsList(e.detail.index,'hits')
  },
  //获取商品列表
  getGoodsList: function(index, type) {
    wx.showLoading({
      title: '数据加载中',
    });
    wx.cloud.callFunction({
      name: 'getGoodsList',
      data: {
        orderby: type
      },
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '加载成功',
          icon: 'success'
        })
        console.log("获取成功", res)
        this.setData({
          ['tab[' + index + '].content']: res.result.data
        })
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

  onLoad: function() {
    wx.showNavigationBarLoading()
    // 获取用户信息
    this.getGoodsList(0, 'updatetime');
    this.getGoodsList(1, 'hits');
  },

  onShow: function() {
    wx.hideNavigationBarLoading()
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  }


})