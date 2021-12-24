var app = getApp();
const db = wx.cloud.database()
const user = db.collection("user")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    team: "",
    name: "",
    captain: false,
    groupdate:[]
  },
  onLoad: function (options) {
    this.getUserInfo()
    // this.setData({
    //   team: app.globalData.group,
    //   name: app.globalData.name,
    //   captain: app.globalData.captain
    // })
    // console.log(app.globalData)
    // console.log(this.data.team)
    // console.log(this.data.name)
  },

  onShow: function () {
    // this.getDuty()
    this.getUserInfo()
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
  toInfo(){
    wx.navigateTo({
      url: '/pages/info/info',
    })
  },
  getDuty(){
    db.collection("onDuty").where({
      team: app.globalData.group,
      progress:true,
    }).orderBy('submit_time','desc').field({
      date: true,
      interval: true,
      _id:true
    }).get().then(res => {
      console.log(res)
      this.setData({
        groupdate:res.data
      })
    })
  },

  getUserInfo(){
    let that = this
    wx.cloud.callFunction({
      name: 'getUserInfo',
    }).then(function (res) {
      let result = res.result
      if(result.flag){
        app.globalData = {
          group: result.data.group,
          name: result.data.name,
          captain: result.data.captain,
          openid: result.data._id,
          phone: result.data.phone,
          stuid: result.data.stuid
        }
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
  }
})