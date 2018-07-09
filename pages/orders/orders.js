// pages/orders/orders.js
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

    allList:[{
      id: 0,
      name: '陈师傅',
      status: '已完成',
      date: '7月8日',
      startTime: '11:10',
      endTime: '11:30',
      startLocation: "丽水学院",
      endLocation: "丽水站"
    },{
      id: 0,
      name: '陈师傅',
      status: '已完成',
      date: '7月8日',
      startTime: '11:10',
      endTime: '11:30',
      startLocation: "丽水学院",
      endLocation: "丽水站"
      },{
        id: 0,
        name: '陈师傅',
        status: '已完成',
        date: '7月8日',
        startTime: '11:10',
        endTime: '11:30',
        startLocation: "丽水学院",
        endLocation: "丽水站"
    }],
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
        console.info(res.windowHeight);
        var height = res.windowHeight;
        console.log(height);
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