// pages/orders/orders.js
import util from '../../utils/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperTitle: [{
      text: "全部",
      id: 1
    }, {
      text: "已完成",
      id: 2
    }, {
      text: "未完成",
      id: 3
    }],
    currentPage: 0,

    allList:[],
    comList:[],
    uncomList:[]
  },
  turnPage: function (e) {
    this.setData({
      currentPage: e.currentTarget.dataset.index
    })
  },
  turnTitle: function (e) {
    if (e.detail.source == "touch") {
      this.setData({
        currentPage: e.detail.current
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.info(res.windowHeight);
        var height = res.windowHeight;
        // console.log(height);
        that.setData({
          scrollHeight: height
        });
      }
    });
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
    var that = this
    util.request({
      url: "http://localhost:8000/api/passenger/getOrderInfoByPassengerId",
      method: "get"
    }).then((res) => {
      // console.log(res)
      for (var i=0; i<res.result.length; i++){
        var startTime = that.startTimeFormat(res.result[i].startTime)
        res.result[i].startTime = startTime
        var endTime = that.endTimeFormat(res.result[i].endTime)
        res.result[i].endTime = endTime
      }
      if (res.status == 3){
        for (var i = 0; i < res.result.length; i++) {
          res.result[i].status = '已完成'
        }
        that.setData({
          comList: res.result,
          allList: res.result
        })
      } else {
        for (var i = 0; i < res.result.length; i++) {
          res.result[i].status = '未完成'
        }
        that.setData({
          uncomList: res.result,
          allList: res.result
        })
      }

    })
  },
  // 开始时间格式化
  startTimeFormat(e){
    var time = e;
    var d = new Date(time);
    var times = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
    return times;
  },
  // 结束时间格式化
  endTimeFormat(e){
    var time = e;
    var d = new Date(time);
    var times = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    return times;
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