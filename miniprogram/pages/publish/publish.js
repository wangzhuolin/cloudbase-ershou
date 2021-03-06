// pages/publish/publish.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    location: {
      address: '',
      latitude: 0,
      longitude: 0
    },
    category: 0,
    array: ['数码产品', '学习资料', '体育用品', '生活用品'],
    objectArray: [{
        id: 0,
        name: '数码产品'
      },
      {
        id: 1,
        name: '学习资料'
      },
      {
        id: 2,
        name: '体育用品'
      },
      {
        id: 3,
        name: '生活用品'
      }
    ],
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      category: Number(e.detail.value)
    })
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e);
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
    if (e.detail.value.category && e.detail.value.tel && e.detail.value.desc && e.detail.value.location && e.detail.value.price && e.detail.value.title) {
      if (this.data.fileList.length == 0) {
        wx.showToast({
          icon: 'none',
          title: '未上传图片'
        })
        return
      }
      wx.showLoading({
        title: '正在发布',
      });
      const db = wx.cloud.database()
      const _ = db.command
      var imgList = []; //获取data-list
      const {
        fileList = []
      } = this.data
      fileList.forEach((item, index, fileList) => {
        imgList.push(item.url);
      })
      db.collection('goods_list').add({
        data: {
          category: this.data.category,
          title: e.detail.value.title,
          price: Number(e.detail.value.price),
          tel: e.detail.value.tel,
          desc: e.detail.value.desc,
          address: e.detail.value.location,
          imglist: imgList,
          thumb: this.data.fileList[0].url,
          location: db.Geo.Point(this.data.location.longitude, this.data.location.latitude),
          addtime: db.serverDate(),
          updatetime: db.serverDate(),
          hits: 0
        },
        success: res => {
          console.log('发布成功', res)
          wx.hideLoading();
          wx.showToast({
            icon: 'success',
            title: '发布成功',
            complete: res => {
              wx.redirectTo({
                url: '/pages/my/goods/goods',
              })
            }
          })
        },
        fail: err => {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '发布失败'
          })
          console.log(err)
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请填写完整信息'
      })
    }
  },

  chooseLocation: function() {
    wx.chooseLocation({
      success: res => {
        console.log(res)
        this.setData({
          location: {
            address: res.name,
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
      },
    })
  },

  previewImg: function(event) {
    var src = event.detail.url; //获取data-src
    var imgList = []; //获取data-list
    const {
      fileList = []
    } = this.data
    fileList.forEach((item, index, fileList) => {
      imgList.push(item.url);
    })
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  deleteToCloud: function(event) {

    let fileID = event.detail.file.url
    let index = event.detail.index
    let fileList_new = this.data.fileList
    wx.showLoading({
      title: '正在删除',
    });
    wx.cloud.deleteFile({
      fileList: [fileID],
      success: res => {
        console.log("图片删除成功", res)
        fileList_new.splice(index, 1);
        wx.hideLoading();
        wx.showToast({
          icon: 'success',
          title: '删除成功'
        })
        this.setData({
          fileList: fileList_new
        })
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '删除失败'
        })
        console.log(err)
      }
    })
  },
  uploadToCloud: function(event) {
    const {
      fileList = []
    } = this.data
    const {
      file
    } = event.detail
    file.forEach((item, index, file) => {
      wx.showLoading({
        title: '正在提交',
      });
      wx.cloud.uploadFile({
        cloudPath: `goods/${(new Date()).getTime() + Math.floor(9 * Math.random())}` + ".jpg", // 上传至云端的路径
        filePath: item.url, // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          fileList.push({
            url: res.fileID
          });
          this.setData({
            fileList
          });
          console.log('fileID', res.fileID)
          console.log('fileList', fileList)
          wx.hideLoading();
        },
        fail: function() {
          wx.hideLoading();
          console.error
        }
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.openid) {
      wx.showToast({
        icon: 'none',
        title: '请登陆后发布',
        complete: res => {
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/my/my',
            })
          }, 2000);
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  }
})