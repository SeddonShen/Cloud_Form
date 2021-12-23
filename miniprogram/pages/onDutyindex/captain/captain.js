const db = wx.cloud.database()
const onDuty = db.collection("onDuty")
var util = require('../../../utils/util.js')
var app = getApp()

var id

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2020-09-01',
    expostor: 2,
    hall_desk: 2,
    teenager_learn: 2,
    expose_robot: 2,
    expostor_desk: 4,
    interval: '上午',
    interval_picker: ['上午', '下午' ,'晚上'],
    information_desk: 2,
    number: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    submit:false
  },

  submit(e) {
    wx.showLoading({
      title: '发布中..',
      mask: 'true'
    })
    console.log(e)
    var duty = {}
    var setDuty = e.detail.value

    duty.expostor = {}
    duty.information_desk = {}
    duty.expostor_desk = {}
    duty.expose_robot = {}
    duty.teenager_learn = {}
    duty.hall_desk = {}
    duty.interval = setDuty.interval
    duty.date = setDuty.date
    duty.team = app.globalData.group
    duty.submit_time = util.formatTime(new Date())
    duty.progress = true

    duty.expostor.limit = setDuty.expostor
    duty.information_desk.limit = setDuty.information_desk
    duty.expostor_desk.limit = setDuty.expostor_desk
    duty.expose_robot.limit = setDuty.expose_robot
    duty.teenager_learn.limit = setDuty.teenager_learn
    duty.hall_desk.limit = setDuty.hall_desk

    duty.expostor.member = []
    duty.information_desk.member = []
    duty.expostor_desk.member = []
    duty.expose_robot.member = []
    duty.teenager_learn.member = []
    duty.hall_desk.member = []
    duty.openid = []

    console.log(duty)
    onDuty.add({
      data: duty
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '发布成功',
        mask: 'true',
        success: () => {
          id=res._id
        }
      })
      this.setData({
        submit:true
      })
    }).catch(err => {
      console.log(err)
    })
  },

  expostorChange(e) {
    this.setData({
      expostor: parseInt(e.detail.value)
    })
  },

  hall_deskChange(e) {
    this.setData({
      hall_desk: parseInt(e.detail.value)
    })
  },

  teenager_learnChange(e) {
    this.setData({
      teenager_learn: parseInt(e.detail.value)
    })
  },

  expose_robotChange(e) {
    this.setData({
      expose_robot: parseInt(e.detail.value)
    })
  },

  expostor_deskChange(e) {
    this.setData({
      expostor_desk: parseInt(e.detail.value)
    })
  },

  information_deskChange(e) {
    this.setData({
      information_desk: parseInt(e.detail.value)
    })
  },

  intervalChange(e) {
    this.setData({
      interval: this.data.interval_picker[e.detail.value],
      expostor_desk: e.detail.value == 0 ? 4 : 2
    })
  },

  dateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = util.pickerData(new Date())
    this.setData({
      date: date
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
  onShareAppMessage(res) {
    if (res.from === 'button') {
      return {
        title: this.data.date+"日报班任务",
        path: 'pages/onDutyindex/signup/signup?_id=' + id+'&type=share'
      }
    }
  }
})