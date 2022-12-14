var app = getApp();
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    team:"",
    groupdate:[]
  },
  tolook() {
    wx.navigateTo({
        url: '/pages/onDutyindex/look/detail/detail',
    })},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      team: app.globalData.group,
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
    db.collection("onDuty").where({
      team: app.globalData.group,
    }).orderBy('submit_time','desc').field({
      datesend: true,
      time_begin:true,
      time_end:true,
      // interval: true,
      progress:true,
      _id:true
    }).get().then(res => {
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