const app = getApp()
var array = [];
Page({

  data: {
    star: 0,
    starMap: [
       '','','','','',
    ],
    play:'',
    content:''
  },
  myStarChoose(e) {
      let star = parseInt(e.target.dataset.star) || 0;
      this.setData({
          star: star,
      });
  },

 

  serviceValChange: function (e) {
    var allGoodsFilte = this.data.list;
    var checkArr = e.detail.value;
    for (var i = 0; i < allGoodsFilte.length; i++) {
      if (checkArr.indexOf(i+"")!=-1) {
        allGoodsFilte[i].checked = true;
        console.log(allGoodsFilte[i].checked)
      } else {
        allGoodsFilte[i].checked = false;
        console.log(allGoodsFilte[i].checked)
      }
    }
    this.setData({
      list: allGoodsFilte
    })
  },

  onLoad(){
    wx.getStorage({
      key:'driver',
      success: (res)=>{
          console.log(res.data)
          this.setData({
            driver:res.data
          })
      } 
    })
  // console.log(app.globalData.play)
    this.setData({
      play: app.globalData.play
    })
  },

  // 拨打电话
  calling: function () {
    var that = this;
    // wx.request({
    //   url: '',
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     that.setData({
    //       phone: res.data.phone
    //     })
    //   }
    // })
    wx.makePhoneCall({
      // phoneNumber: this.phone,
      phoneNumber: "12345678900",
      success: function () {
        console.log("拨打电话成功")
      },
      fail: function () {
        console.log("拨打电话失败")
      }
    })
  },
  // 获取投诉内容
  bindTextAreaBlur: function(e){
    this.setData({
      content: e.detail.value
    })
  },
  // 提交投诉
  submit: function(e) {
    console.log(this.data.content)
    wx.showLoading({
      title: '提交中',
    })
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }, 2000)
  }
});