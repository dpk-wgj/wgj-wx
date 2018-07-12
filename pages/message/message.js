// pages/orders/orders.js
import util from '../../utils/index';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperTitle: [{
      text: '已反馈',
      id: 1
    }, {
      text: "未反馈",
      id: 2
    }],
    currentPage: 0,
    comList: [],
    uncomList: [{}]
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
  // 撤销投诉
  cancel: function(e){
    console.log(e.currentTarget.dataset.id)
    let p = {
      complaintId: e.currentTarget.dataset.id
    }
    util.request({
      url: "http://localhost:8000/api/passenger/deleteComplaintInfoByCommentId",
      method: "post",
      data: p
    }).then((res) => {
      console.log(res)
    })
    wx.redirectTo({
      url: '/pages/message/message',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // setTimeout(function () {
    //   console.log('passengerId:', app.globalData.passengerId)
    // }, 1000);
    
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
    util.request({
      url: "http://localhost:8000/api/passenger/getComplaintInfoByPassengerId",
      method: "post"
    }).then((res) => {
      // console.log(res)
      // for(var i=0; i<res.result.length; i++){
      //   console.log(res.result)
      // }
      if(res.status == 1){    //未反馈状态
        var result = res.result
        var uncomList = result.reverse();
        that.setData({
          uncomList: uncomList
        })
      } else{     //反馈状态
        var result = res.result
        var comList = result.reverse();
        that.setData({
          comList: comList
        })
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
    var that = this
    // util.request({
    //   url: "http://localhost:8000/api/passenger/getOrderInfoByPassengerId",
    //   method: "get"
    // }).then((res) => {
    //   console.log(res)
    //   for (var i=0; i<res.result.length; i++){
    //     var startTime = that.timeFormat(res.result[i].startTime)
    //     res.result[i].startTime = startTime
    //     var endTime = that.timeFormat(res.result[i].endTime)
    //     res.result[i].endTime = endTime
    //   }
    //   if (res.status == 3){
    //     for (var i = 0; i < res.result.length; i++) {
    //       res.result[i].status = '已完成'
    //     }
    //     that.setData({
    //       comList: res.result,
    //       allList: res.result
    //     })
    //   } else {
    //     for (var i = 0; i < res.result.length; i++) {
    //       res.result[i].status = '未完成'
    //     }
    //     that.setData({
    //       uncomList: res.result,
    //       allList: res.result
    //     })
    //   }
      

    // })
  },
  // 时间格式化
  timeFormat(e){
    var time = e;
    var d = new Date(time);
    var times = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
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