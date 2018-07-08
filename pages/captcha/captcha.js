// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nextBtnDisabled: true,
    nextBtnBc: '#bcbcbc',
    captcha: '',
    date: '请选择日期',
    fun_id: 2,
    time: '发送', //倒计时 
    currentTime: 61,
    disabled: true
  },

  // testCaptcha: function (s) {
  //   if (s != null && s) {
  //     var length = s.length
  //     if (length = 6) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   }
  // },
  // 输入验证码事件
  phoneInput: function (e) {
    var _self = this
    _self.setData({ captcha: e.detail.value})
    // var isPhone = _self.testCaptcha(e.detail.value)
    // if (isPhone) {
      _self.setData({
        nextBtnDisabled: false,
        nextBtnBc: '#4a4c5b'
      })
    // } else {
      // _self.setData({
      //   nextBtnDisabled: true,
      //   nextBtnBc: '#bcbcbc'
      // })
    // }
  },
  // 清空验证码
  deleteCaptha: function () {
    this.setData({ captcha: ''})
  },
  // 登录
  login: function () {
    app.globalData.userInfo = {captcha: this.data.captcha}
    console.log(app.globalData.userInfo)
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    var interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 100)
  },
  getVerificationCode() {
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },
  onLoad: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    var interval = setInterval(function () {
    currentTime--;
    that.setData({
      time: currentTime + '秒'
    })
    if (currentTime <= 0) {
      clearInterval(interval)
      that.setData({
        time: '发送',
        currentTime: 61,
        disabled: false
      })
    }
  }, 100)
  }
})