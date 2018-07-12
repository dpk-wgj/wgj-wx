import util from '../../utils/index';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key:'DHNBZ-2ZLKK-T7IJJ-AXSQW-WX5L6-A6FJZ'
});
const app = getApp()
Page({
    data: {
        currentTab: 1,
        currentCost: 0,
        cart: '',
        navScrollLeft: 0,
        duration: 1000,
        interval: 5000,
        isLoading: true,
        color:"#cccccc",
        callCart: true,
        destination: '',
        bluraddress : '',
        index: '',
        address: '',
        hasMessage: false,
        startLatitude: '',
        startLongitude: '',
        endLatitude: '',
        endLongitude: ''
    },
    onLoad: function(options) {
      this.requestCart();
      this.requestWaitingtime();
      this.hasMessage();
      var that = this
      setTimeout(function () {
        that.setData({
          address: app.globalData.bluraddress,
          startLatitude: app.globalData.strLatitude,
          startLongitude: app.globalData.strLongitude,
          destination: app.globalData.destination,
          currentTab: app.globalData.id,
        })
      }, 1000)
      
    },
    requestCart(e){
        util.request({
            url: 'https://www.easy-mock.com/mock/5aded45053796b38dd26e970/comments#!method=get',
            mock: false,
          }).then((res)=>{
       
            const navData = res.data.navData;
            const imgUrls = res.data.imgUrls;
            const cost = res.data.cost
            this.setData({
                navData,
                imgUrls,
                cost
            })
          })
    },
    onShow(){
        // this.setData({
        //     address:app.globalData.bluraddress,
        //     destination:app.globalData.destination,
        //     currentTab:app.globalData.id,
        // })
      
        
    },
    requestWaitingtime(){
        setTimeout(() => {
            util.request({
                url: 'https://www.easy-mock.com/mock/5aded45053796b38dd26e970/comments#!method=get',
                mock: false,
                data: {
                }
              }).then((res)=>{
              const arr = res.data.waitingTimes;
            //   console.log(arr)
                var index = Math.floor((Math.random()*arr.length));
                // console.log(arr[index])
                this.setData({
                isLoading:false,
                waitingTimes: arr[index]
                })
              })
        }, 1000);
    },
  //  一键叫车
    toWait(e){
      var that = this
      const destination =this.data.destination
      if(destination==''){
        wx.showToast({
            title: '目的地不能为空',
            icon: 'fail',
           mask: true,
            duration: 1000
          })
      }else{
        let param = {
          startLocation: app.globalData.strLatitude + ',' + app.globalData.strLongitude,
          endLocation: app.globalData.endLatitude + ',' + app.globalData.endLongitude,
          locationInfo: app.globalData.strLatitude + ',' + app.globalData.strLongitude + '-' +      app.globalData.endLatitude + ',' + app.globalData.endLongitude
        }
        // console.log(param)
        util.request({
          url: "http://localhost:8000/api/passenger/addOrderInfo",
          method: "post",
          data : param
        }).then((res) => {
          console.log(res)
        })

        wx.navigateTo({
          url: '/pages/wait/wait',
        })
      }
      
       
    },
    switchNav(event){
     
        this.requestWaitingtime();
       const cart = event.currentTarget.dataset.name
        let text = this.data.navData;
        this.setData({
            cart,
            isLoading:true,
            waitingTimes: ''
        })
        var cur = event.currentTarget.dataset.current; 
        var singleNavWidth = this.data.windowWindth/6;
        
        this.setData({
            navScrollLeft: (cur - 1) * singleNavWidth,
            currentTab: cur,
        })      
    },
    switchCart(e){
        const id = e.currentTarget.dataset.index;
        this.setData({
          index:id,
          
        })
       
    },
    switchTab(event){
        var cur = event.detail.current;
        var singleNavWidth =55;
        this.setData({
            currentTab: cur,
            navScrollLeft: (cur - 1) * singleNavWidth
        });
    },

    // 点击用户
    showUser(){
      // console.log(app.globalData.userInfo.phone)
      // console.log(app.globalData.userInfo.captcha)
    // 如果全局未存手机号进入登录页
      if (app.globalData.userInfo && app.globalData.userInfo.phone){
      
      wx.navigateTo({
        url: "/pages/my/my",
      })
    }else{
        wx.navigateTo({
        url:  "/pages/login/login",
        })
    }
    },
    onChange(e){
        const currentCost = e.target.dataset.index;
        this.setData({
            currentCost
        })
      
    },

    // 判断是否有新消息
    hasMessage: function() {
      this.setData({
        hasMessage: true
      })
    },
    // 获取位置
    // getLoc: function(){
    //   var that = this;
    //   wx.getLocation({
    //     type: 'wgs84',
    //     success: function(res) {
    //       console.log(res)
    //       qqmapsdk.reverseGeocoder({
    //         location: {
    //           latitude: res.latitude,
    //           longitude: res.longitude
    //         },
    //         success: function (addressRes) {
    //           var address = addressRes.result.formatted_addresses.recommend;
    //           // console.log(address)
    //           app.globalData.bluraddress = address;
    //           app.globalData.strLatitude = addressRes.result.location.lat;
    //           app.globalData.strLongitude = addressRes.result.location.lng;
    //           that.setData({
    //             address: app.globalData.bluraddress,
    //           })
    //           console.log('index.app:' + app.globalData.bluraddress)
    //           console.log('index.address:' + that.data.address)
    //         }
    //       })
    //     },
    //   })
    // }

})