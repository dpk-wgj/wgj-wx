const app = getApp()
Page({
  data: {
    star: 0,
    starMap: [
      '', '', '', '', '',
    ],
    play: '',
    id: 0,
    startTime: '',
    endTime: '',
    startLocation: '',
    endLocation: ''
  },
  
  myStarChoose(e) {
    let star = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star: star,
    });
  },
  onLoad(options) {
    // console.log(options)
    wx.getStorage({
      key: 'driver',
      success: (res) => {
        // console.log(res.data)
        this.setData({
          driver: res.data
        })
      }
    })
    // console.log(app.globalData.play)
    this.setData({
      play: app.globalData.play,
      id: options.id,
      startTime: options.startTime,
      endTime: options.endTime,
      startLocation: options.startLocation,
      endLocation: options.endLocation
    })
  },
  toIndex() {

    wx.showLoading({
      title: '提交中',
    })
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }, 2000)

  },
  // 拨打电话
  calling: function () {
    var that = this;
    // wx.request({
    //   url: '',
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     that.setData({
    //       phone: res.data.phone
    //     })
    //   }
    // })
    wx.makePhoneCall({
      // phoneNumber: this.phone,
      phoneNumber: "12345678900",
      success: function () {
        console.log("拨打电话成功")
      },
      fail: function () {
        console.log("拨打电话失败")
      }
    })
  }
});