import util from '../../utils/index';

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key:'DHNBZ-2ZLKK-T7IJJ-AXSQW-WX5L6-A6FJZ'
});
const app = getApp();
Page({
  data: {
    value: '',
    address: []
  },
onLoad(){
  // this.requestHistory();
},
// requestHistory(e){
//   util.request({
//       url: 'https://www.easy-mock.com/mock/5aded45053796b38dd26e970/comments#!method=get',
//       mock: false,
//     }).then((res)=>{
 
//       const entity = res.data.entity;
  
//       this.setData({
//         entity
//       })
//     })
//   },
  // 跳转到首页
  toIndex(e){
    const destination = e.currentTarget.dataset.destination;
    const endAddress =  e.currentTarget.dataset.end;
    console.log('e:', e.currentTarget.dataset)
    qqmapsdk.geocoder({
      address: endAddress,
      success: function(res){
        console.log('目的地经纬度：', res.result)
        app.globalData.endLatitude=res.result.location.lat;
        app.globalData.endLongitude= res.result.location.lng;
        console.log('搜索到:',app.globalData.endLongitude, app.globalData.endLatitude)
      },
      fail: function (res) {
        console.log('搜索失败：', res)
        app.globalData.strLatitude = 0;
        app.globalData.strLongitude = 0;
      }
    })
    app.globalData.destination=destination,
    wx.redirectTo({
      url: "/pages/index/index",
    })
  },

  switchCity(e){
    qqmapsdk.getCityList({
      success: function(res){
        console.log(res)
      }
    })
  },
  searchInputend(e){
   
    var that = this;
    var  value = e.detail.value
    var address = that.address;
   
    qqmapsdk.getSuggestion({
      keyword: value,
      region: '青田',
      success: function(res){
        let data = res.data
      that.setData({
        address: data,
        value
      })
      }
    })
  },
  
})