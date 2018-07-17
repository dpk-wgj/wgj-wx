import util from './utils/index';
var QQMapWX = require('libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: 'DHNBZ-2ZLKK-T7IJJ-AXSQW-WX5L6-A6FJZ'
});
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: res => {
        var d = this.globalData;//这里存储了appid、secret、token串  
        var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
        // console.log(res)
        util.request({
          url: url
        }).then((res1) => {
          if(res1.openid){
            // console.log("登录：", res1)
            this.globalData.openid = res1.openid
            let param = {
              passengerWxId: "cqj",//this.globalData.openid,
              // driverName: 
            }
            util.request({
              url: `${this.globalData.baseUrl}/public/passenger/login`,
              method: "post",
              data: param
            }).then(res2 => {
              if(res2.status === 1){
                // console.log(res2)
                this.globalData.userInfo = res2.result.passenger
                // console.log(this.globalData.userInfo)
              }              // console.log("后台请求登录：", res2)
              // this.globalData.passengerId = res2.result.passenger.passengerId
              // console.log(this.globalData.passengerId)

            })
 
          }
              
        })
        
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    
    // 获取位置
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            // console.log(address)
            that.globalData.bluraddress = address;
            that.globalData.strLatitude = addressRes.result.location.lat;
            that.globalData.strLongitude = addressRes.result.location.lng;
          }
        })
      }
    })
    // 获取用户信息
  },
  globalData: {
    baseUrl: 'http://localhost:8000',
    baseWsUrl: 'ws://localhost:8000',
    passengerId: 0,
    userInfo: null,
    driverInfo: null,
    socketOpen: false,
    socketMsgQueue: [],
    bluraddress: '公交站',
    destination: '',
    id: '快车',
    strLatitude: 0,
    strLongitude: 0,
    endLatitude: 0,
    endLongitude: 0,
    play: '18.7',
    openid: "",
    appid: 'wx8884af693e78552c',
    secret: '3df93d09a28a4d5fa9199088c89811f8',
  }
})