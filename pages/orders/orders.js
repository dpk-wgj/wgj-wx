// pages/orders/orders.js
import util from '../../utils/index';
const app = getApp()
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
      url: `${app.globalData.baseUrl}/api/passenger/getOrderInfoByPassengerId`,
      method: "get"
    }).then((res) => {
      console.log(res)
      var all = []
      var com = []
      var uncom = []
      for (var i=0; i<res.result.length; i++){
        var startTime = that.startTimeFormat(res.result[i].orderInfo.startTime)
        res.result[i].orderInfo.startTime = startTime
        var endTime = that.endTimeFormat(res.result[i].orderInfo.endTime)
        res.result[i].orderInfo.endTime = endTime
        if (res.result[i].orderInfo.orderStatus == 3){        //正确 == 3
          res.result[i].orderInfo.orderStatus = "已完成"
          all.push(res.result[i])
          com.push(res.result[i])
        } else{
          if (res.result[i].orderInfo.orderStatus == 0){
            res.result[i].driverInfo.driverName = "司机未接单"
          }
          res.result[i].orderInfo.endTime = ''
          res.result[i].orderInfo.orderStatus = "未完成"
          all.push(res.result[i])
          uncom.push(res.result[i])
        }
      }
      that.setData({
        comList: com,
        uncomList: uncom,
        allList: all
      })
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
  onShareAppMessage: function () {}
})