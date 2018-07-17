// pages/orders/orders.js
import util from '../../utils/index';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: 'DHNBZ-2ZLKK-T7IJJ-AXSQW-WX5L6-A6FJZ'
});
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // swiperTitle: [{
    //   text: "全部",
    //   id: 1
    // }, {
    //   text: "已完成",
    //   id: 2
    // }, {
    //   text: "未完成",
    //   id: 3
    // }],
    swiperTitle: [{
      text: "已完成",
      id: 1
    }, {
      text: "未完成",
      id: 2
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
    var that = this
    util.request({
      url: `${app.globalData.baseUrl}/api/passenger/getOrderInfoByPassengerId`,
      method: "get"
    }).then((res) => {
      console.log(res)
      var all = []
      var com = []
      var uncom = []
      for (var i = 0; i < res.result.length; i++) {
        var startTime = that.startTimeFormat(res.result[i].orderInfo.startTime)
        res.result[i].orderInfo.startTime = startTime
        var endTime = that.endTimeFormat(res.result[i].orderInfo.endTime)
        res.result[i].orderInfo.endTime = endTime

        if (res.result[i].orderInfo.orderStatus == 3) {        //正确 == 3
          res.result[i].orderInfo.orderStatus = "已完成"
          // all.push(res.result[i])
          com.push(res.result[i])
        } else {

          if (res.result[i].orderInfo.orderStatus == 0) {
            res.result[i].driverInfo.driverName = "司机未接单"
          }
          res.result[i].orderInfo.endTime = ''
          res.result[i].orderInfo.orderStatus = "未完成"
          // all.push(res.result[i])
          uncom.push(res.result[i])
        }
      }
      // all.push(uncom)
      that.setData({
        comList: com,
        uncomList: uncom,
        // allList: all
      })

      // 转换位置信息 全部
      // var all = this.data.allList
      // // console.log('all',all)
      // // console.log(all[0].orderInfo)
      // for (let i = 0; i < all.length; i++) {
      //   let startStr = all[i].orderInfo.startLocation
      //   let start = startStr.split(',')
      //   let startLocation;
      //   qqmapsdk.reverseGeocoder({
      //     location: {
      //       latitude: start[1],
      //       longitude: start[0]
      //     },
      //     success: function (addressRes) {
      //       startLocation = addressRes.result.formatted_addresses.recommend;
      //       all[i].orderInfo.startLocation = startLocation
      //       that.setData({
      //         allList: all
      //       })
      //     }
      //   })
      //   let endStr = all[i].orderInfo.endLocation
      //   let end = endStr.split(',')
      //   let endLocation;
      //   qqmapsdk.reverseGeocoder({
      //     location: {
      //       latitude: end[1],
      //       longitude: end[0]
      //     },
      //     success: function (addressRes) {
      //       endLocation = addressRes.result.formatted_addresses.recommend;
      //       all[i].orderInfo.endLocation = endLocation
      //       that.setData({
      //         allList: all
      //       })
      //     }
      //   })
      // }
      // 转换位置信息 已完成
      var com = this.data.comList
      // console.log('all',all)
      // console.log(all[0].orderInfo)
      for (let i = 0; i < com.length; i++) {
        let startStr = com[i].orderInfo.startLocation
        let start = startStr.split(',')
        let startLocation;
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: start[1],
            longitude: start[0]
          },
          success: function (addressRes) {
            startLocation = addressRes.result.formatted_addresses.recommend;
            com[i].orderInfo.startLocation = startLocation
            that.setData({
              comList: com
            })
          }
        })
        let endStr = com[i].orderInfo.endLocation
        let end = endStr.split(',')
        let endLocation;
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: end[1],
            longitude: end[0]
          },
          success: function (addressRes) {
            endLocation = addressRes.result.formatted_addresses.recommend;
            com[i].orderInfo.endLocation = endLocation
            that.setData({
              comList: com
            })
          }
        })
      }

      // 转换位置信息 未完成
      var uncom = this.data.uncomList
      setTimeout(function () {
      for (let i = 0; i < uncom.length; i++) {
        let startStr = uncom[i].orderInfo.startLocation
        let start = startStr.split(',')
        let startLocation;
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: start[1],
            longitude: start[0]
          },
          success: function (addressRes) {
            startLocation = addressRes.result.formatted_addresses.recommend;
            console.log('start:', startLocation)
            uncom[i].orderInfo.startLocation = startLocation
            that.setData({
              uncomList: uncom
            })
          }
        })
        let endStr = uncom[i].orderInfo.endLocation
        let end = endStr.split(',')
        let endLocation;
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: end[1],
            longitude: end[0]
          },
          success: function (addressRes) {
            endLocation = addressRes.result.formatted_addresses.recommend;
            console.log('end:', endLocation)
            uncom[i].orderInfo.endLocation = endLocation
            that.setData({
              uncomList: uncom
            })
          }
        })
      }
      }, 500)
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
    // var that = this
    // util.request({
    //   url: `${app.globalData.baseUrl}/api/passenger/getOrderInfoByPassengerId`,
    //   method: "get"
    // }).then((res) => {
    //   console.log(res)
    //   var all = []
    //   var com = []
    //   var uncom = []
    //   for (var i=0; i<res.result.length; i++){
    //     var startTime = that.startTimeFormat(res.result[i].orderInfo.startTime)
    //     res.result[i].orderInfo.startTime = startTime
    //     var endTime = that.endTimeFormat(res.result[i].orderInfo.endTime)
    //     res.result[i].orderInfo.endTime = endTime

    //     if (res.result[i].orderInfo.orderStatus == 3){        //正确 == 3
    //       res.result[i].orderInfo.orderStatus = "已完成"
    //       all.push(res.result[i])
    //       com.push(res.result[i])
    //     } else{

    //       if (res.result[i].orderInfo.orderStatus == 0){
    //         res.result[i].driverInfo.driverName = "司机未接单"
    //       }
    //       res.result[i].orderInfo.endTime = ''
    //       res.result[i].orderInfo.orderStatus = "未完成"
    //       all.push(res.result[i])
    //       uncom.push(res.result[i])
    //     }
    //   }
    //   that.setData({
    //     comList: com,
    //     uncomList: uncom,
    //     allList: all
    //   })
    //   // 转换位置信息 全部
    //   var all = this.data.allList
    //   // console.log('all',all)
    //   // console.log(all[0].orderInfo)
    //   for (let i = 0; i < all.length; i++){
    //     let startStr = all[i].orderInfo.startLocation
    //     let start = startStr.split(',')
    //     let startLocation;
    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: start[1],
    //         longitude: start[0]
    //       },
    //       success: function (addressRes) {
    //         startLocation = addressRes.result.formatted_addresses.recommend;
    //         all[i].orderInfo.startLocation = startLocation
    //         that.setData({
    //           allList: all
    //         })
    //       }
    //     })
    //     let endStr = all[i].orderInfo.endLocation
    //     let end = endStr.split(',')
    //     let endLocation;
    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: end[1],
    //         longitude: end[0]
    //       },
    //       success: function (addressRes) {
    //         endLocation = addressRes.result.formatted_addresses.recommend;
    //         all[i].orderInfo.endLocation = endLocation
    //         that.setData({
    //           allList: all
    //         })
    //       }
    //     })
    //   }
    //   // 转换位置信息 已完成
    //   var com = this.data.comList
    //   // console.log('all',all)
    //   // console.log(all[0].orderInfo)
    //   for (let i = 0; i < com.length; i++) {
    //     let startStr = com[i].orderInfo.startLocation
    //     let start = startStr.split(',')
    //     let startLocation;
    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: start[1],
    //         longitude: start[0]
    //       },
    //       success: function (addressRes) {
    //         startLocation = addressRes.result.formatted_addresses.recommend;
    //         com[i].orderInfo.startLocation = startLocation
    //         that.setData({
    //           comList: com
    //         })
    //       }
    //     })
    //     let endStr = all[i].orderInfo.endLocation
    //     let end = endStr.split(',')
    //     let endLocation;
    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: end[1],
    //         longitude: end[0]
    //       },
    //       success: function (addressRes) {
    //         endLocation = addressRes.result.formatted_addresses.recommend;
    //         com[i].orderInfo.endLocation = endLocation
    //         that.setData({
    //           comList: com
    //         })
    //       }
    //     })
    //   }
    //   // 转换位置信息 未完成
    //   var uncom = this.data.uncomList
    //   for (let i = 0; i < uncom.length; i++) {
    //     let startStr = uncom[i].orderInfo.startLocation
    //     let start = startStr.split(',')
    //     let startLocation;
    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: start[1],
    //         longitude: start[0]
    //       },
    //       success: function (addressRes) {
    //         startLocation = addressRes.result.formatted_addresses.recommend;
    //         console.log('start:', startLocation)
    //         uncom[i].orderInfo.startLocation = startLocation
    //         that.setData({
    //           uncomList: uncom
    //         })
    //       }
    //     })
    //     let endStr = uncom[i].orderInfo.endLocation
    //     let end = endStr.split(',')
    //     let endLocation;
    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: end[1],
    //         longitude: end[0]
    //       },
    //       success: function (addressRes) {
    //         endLocation = addressRes.result.formatted_addresses.recommend;
    //         console.log('end:', endLocation)
    //         uncom[i].orderInfo.endLocation = endLocation
    //         that.setData({
    //           uncomList: uncom
    //         })
    //       }
    //     })
    //   }
    // })
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