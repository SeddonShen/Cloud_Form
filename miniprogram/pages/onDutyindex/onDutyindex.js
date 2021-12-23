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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      team: app.globalData.group,
      name: app.globalData.name,
      captain: app.globalData.captain
    })
    console.log(app.globalData)
    console.log(this.data.team)
    console.log(this.data.name)
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