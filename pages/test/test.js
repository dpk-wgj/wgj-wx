// pages/test/test.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: 'DHNBZ-2ZLKK-T7IJJ-AXSQW-WX5L6-A6FJZ'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test: ''
  },
  bindAction: function(){
    wx.showModal({
      title: '。。。',
      content: '。。。',
      success: function(res){
        if(res.confirm){
          console.log('ok')
          this.test()
        }
      }
    })
  },
  test: function(){
    console.log('test')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var latitude = 28.3448795492
    var longitude = 119.7814268657
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (addressRes) {
        var address = addressRes.result.formatted_addresses.recommend;
        console.log(address)

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})