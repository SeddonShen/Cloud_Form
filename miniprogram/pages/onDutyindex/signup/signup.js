const db = wx.cloud.database()
const onDuty = db.collection("onDuty")
const _ = db.command
const app = getApp()
var _id

var work
var dutyTimes

Page({

  /**
   * 页面的初始数据
   */
  data: {
    work: '',
    onduty: {},
    mywork: [0, 0, 0, 0, 0, 0]
  },

  selectWork(e) {
    console.log(e)
    work = e.detail.value
  },

  getWork() {
    if (!work) {
      wx.showToast({
        title: '请选择',
        icon: 'none'
      })
      return
    }
    this.setData({
      work: work
    })
    var member = work + '.member'
    onDuty.doc(_id).update({
      data: {
        [member]: _.addToSet(app.globalData.name),
        openid: _.addToSet(app.globalData.openid)
      }
    }).catch(err => {
      console.log(err)
    })
    wx.requestSubscribeMessage({
      tmplIds: ['_Vs_yfS8lXCqxQgmtggpFbYTVJtMO2m1bxIyFqBoaro'],
      success: res => {
        console.log('订阅成功')
      },
      fail: err => {
        console.log('订阅失败')
        console.log(err)
      }
    })

    wx.getStorage({//保存报名值班此数的缓存
      key: 'dutyTimes',
      success: res => {
        dutyTimes = res.data
        wx.setStorage({
          data: dutyTimes + 1,
          key: 'dutyTimes',
        })
      },
      fail: err => {
        dutyTimes = 0
        wx.setStorage({
          data: dutyTimes + 1,
          key: 'dutyTimes',
        })
      }
    })
  },

  resetWork() {
    wx.showModal({
      content: '重新选择可能会导致现有岗位被其他志愿者申请哦，是否重新选择',
      confirmColor: '#a5673f',
      complete: res => {
        console.log(res)
        if (res.confirm) {

          var member = work + '.member'
          onDuty.doc(_id).update({
            data: {
              [member]: _.pull(app.globalData.name),
              openid: _.pull(app.globalData.openid)
            }
          }).catch(err => {
            console.log(err)
          })
          this.setData({
            work: ''
          })
          work = ''

          wx.getStorage({//保存报名值班此数的缓存
            key: 'dutyTimes',
            success: res => {
              dutyTimes = res.data
              wx.setStorage({
                data: dutyTimes - 1,
                key: 'dutyTimes',
              })
            },
            fail: err => {
              dutyTimes = 0
              wx.setStorage({
                data: dutyTimes - 1,
                key: 'dutyTimes',
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'share') {
      if (!app.globalData.id) {
        wx.showLoading({
          title: '校验身份信息',
          mask:true,
        })
      }
    }

    _id = options._id
    var that = this
    onDuty.doc(_id).watch({
      onChange: function (snapshot) {
        console.log('snapshot', snapshot)
        var onduty = snapshot.docChanges[0].doc
        that.setData({
          onduty: onduty
        })
        that.test_hasWork(onduty)
      },
      onError: function (err) {
        console.error('the watch closed because of error', err)
      }
    })
  },

  test_hasWork(onduty) {

    var key = app.globalData.name
    var expose_robot = onduty.expose_robot.member
    var expostor = onduty.expostor.member
    var expostor_desk = onduty.expostor_desk.member
    var hall_desk = onduty.hall_desk.member
    var information_desk = onduty.information_desk.member
    var teenager_learn = onduty.teenager_learn.member
    var array = [information_desk, expostor_desk, expose_robot, teenager_learn, hall_desk, expostor]
    for (var i in array) {
      for (var j in array[i]) {
        if (key == array[i][j]) {
          if (i == 0) {
            work = 'information_desk'
            this.setData({
              work: work
            })
          }
          if (i == 1) {
            work = 'expostor_desk'
            this.setData({
              work: work
            })
          }
          if (i == 2) {
            work = 'expose_robot'
            this.setData({
              work: work
            })
          }
          if (i == 3) {
            work = 'teenager_learn'
            this.setData({
              work: work
            })
          }
          if (i == 4) {
            work = 'hall_desk'
            this.setData({
              work: work
            })
          }
          if (i == 5) {
            work = 'expostor'
            this.setData({
              work: work
            })
          }
        }
      }
    }
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
  onShareAppMessage: function () {

  }
})