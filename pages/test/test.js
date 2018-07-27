// pages/test/test.js
Page({
  data:{

  },
  onLoad: function (e) {
    this.includePoints()
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  },
 
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 28.44594,
        longitude: 119.91284, 
      }, {
          latitude: 28.446449,
          longitude: 119.956787, 
      }]
    })
  }
})
