// pages/message/message.js
import util from '../../utils/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{
      star: 4,
      time: '2018-07-09 13:00:00',
      content: '评价评价评价评价评价评价评价评价评价评价评价评价评价评价评价评价评价评价评价评价评价评价'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.request({
      url: "http://localhost:8000/api/passenger/getCommendInfoByOrderId",
      method: "post",
      // data: param
    }).then((res) => {
      console.log(res)
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