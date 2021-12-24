var app = getApp();
const db = wx.cloud.database()
const user = db.collection("user")
Page({
  data: {
    team: "",
    name: "",
    captain: false,
    groupdate: []
  },
  onShow: function () {
    this.getUserInfo()
  },
  
  /**
   * 获取志愿服务列表
   */
  getDuty() {
    db.collection("onDuty").where({
      team: app.globalData.group,
      progress: true,
    }).orderBy('submit_time', 'desc').field({
      datesend: true,
      // interval: true,
      _id: true,
      time_begin:true,
      time_end:true
    }).get().then(res => {
      console.log(res)
      this.setData({
        groupdate: res.data
      })
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    let userInfo = this.getUserInfoFromStorage()
    if (userInfo != '') { // 若缓存中有用户信息
      console.log('使用缓存')
      app.globalData = userInfo
      this.setData({
        name: userInfo.name,
        team: userInfo.group,
        captain: userInfo.captain,
      })
      this.getDuty()
      return
    }
    // 无用户信息时 数据库获取
    let that = this
    wx.cloud.callFunction({
      name: 'getUserInfo',
    }).then(function (res) {
      let result = res.result
      if (result.flag) {
        app.globalData = {
          group: result.data.group,
          name: result.data.name,
          captain: result.data.captain,
          openid: result.data._id,
          phone: result.data.phone,
          stuid: result.data.stuid
        }
        console.log(app.globalData.stuid)
        that.setData({
          team: app.globalData.group,
          name: app.globalData.name,
          captain: app.globalData.captain
        })
        that.getDuty()
      } else {
        wx.redirectTo({
          url: '/pages/info/info'
        })
      }
    })
  },

  tocaptain() {
    wx.navigateTo({
      url: '/pages/onDutyindex/captain/captain',
    })
  },
  tolook() {
    wx.navigateTo({
      url: '/pages/onDutyindex/look/look',
    })
  },
  toInfo() {
    wx.navigateTo({
      url: '/pages/info/info',
    })
  },
  getUserInfoFromStorage() {
    return wx.getStorageSync('user')
  },
})