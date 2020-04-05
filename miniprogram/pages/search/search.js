// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [], // 历史记录
    //hotList: ['菩提珠串', '金石/拓片', '翡翠原石', '和田玉', '邮票', '珍珠'], // 热门推荐
    value: ''
  },

  //搜索关键词监听
  onChange: function(e) {
    this.setData({
      value: e.detail
    });
  },
  //点击搜索，去搜索页面
  onSearch: function() {
    let arr = this.data.historyList
    if (!arr.includes(this.data.value)) {
      arr.push(this.data.value)
      this.setData({
        historyList: arr
      })
      wx.setStorageSync('historyList', this.data.historyList)
    }
    wx.navigateTo({
      url: '/pages/list/list?searchVal=' + this.data.value,
    })
  },
  //点击删除按钮
  del: function() {
    this.setData({
      historyList: []
    })
    wx.removeStorageSync('historyList')
  },
  // 点击历史记录和热门推荐
  goSearch: function(e) {
    let arr = this.data.historyList
    if (!arr.includes(e.currentTarget.dataset.val)) {
      arr.push(e.currentTarget.dataset.val)
      this.setData({
        historyList: arr
      })
      wx.setStorageSync('historyList', this.data.historyList)
    }
    wx.navigateTo({
      url: '/pages/list/list?searchVal=' + e.currentTarget.dataset.val,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (wx.getStorageSync('historyList')) {
      this.setData({
        historyList: wx.getStorageSync('historyList')
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})