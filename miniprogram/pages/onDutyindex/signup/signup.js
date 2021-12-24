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
    _id:'',
    work: '',
    onduty: {},
    mywork: [0, 0, 0, 0, 0, 0]
  },

  people_count(_id){
    db.collection("onDuty").where({
      _id: _id
    }).orderBy('submit_time','desc').field({
      count : true,
      information_desk:true
    }).get().then(res => {
      console.log(res.data[0].count,res.data[0].information_desk.limit)
      if(res.data[0].count < res.data[0].information_desk.limit){
        console.log("True")
        return true
      }
      return false
    })
  },

  // selectWork(e) {
  //   console.log(e)
  //   work = e.detail.value
  // },
  get_ticket(limit){
    var member = work + '.member'
    console.log(member)
    var openid = app.globalData.openid
    var nickname = app.globalData.name
    var stuid = app.globalData.stuid
    var phone = app.globalData.phone
    var that = this
    var submit_time = new Date()
    console.log('到这里')
    db.collection('onDuty').where({
      _id: _id,
      count: _.lt(limit)
    }).update({
      data: {
        count: _.inc(1),
        [member]: _.push({openid,nickname,stuid,phone,submit_time}),
        openid: _.addToSet(app.globalData.openid)
      }
    }).then(function(d){
      if(d.stats.updated > 0) {/*抢购成功*/
        console.log('成功')
        wx.showModal({
          content: '报名成功，请关注后续通知',
          confirmColor: '#a5673f',
          complete: res => {
            console.log(res)
            if (res.confirm) {
              console.log("用户确认")
            }
          }
        })
      }
      else {/*抢购失败*/
        console.log('抢失败')
        wx.showModal({
          content: '报名失败，请刷新重试',
          confirmColor: '#a5673f',
          complete: res => {
            console.log(res)
            if (res.confirm) {
              console.log("用户确认")
            }
          }
        })
      // console.log(d)
      }
    })

    // db.collection("onDuty").where({
    //   _id: _id
    // }).orderBy('submit_time','desc').field({
    //   count : true,
    //   information_desk:true
    // }).get().then(res => {
    //   console.log(res.data[0].count,res.data[0].information_desk.limit)
    //   if(res.data[0].count < res.data[0].information_desk.limit){
    //     // console.log("True")
    //     console.log('还没满')
    //     onDuty.doc(_id).update({
    //       data: {
    //         count:_.inc(1),
    //         [member]: _.push({openid,nickname,stuid,phone}),
    //         openid: _.addToSet(app.globalData.openid)
    //       },
    //       success(res){
    //         // this.setData({
    //         //   work: work
    //         // })
    //         console.log('应该有个弹框')
            // wx.showModal({
            //   content: '报名成功，请关注后续通知',
            //   confirmColor: '#a5673f',
            //   complete: res => {
            //     console.log(res)
            //     if (res.confirm) {
            //       console.log("用户确认")
            //     }
            //   }
            // })
    //       },
    //       fail(res){
            // wx.showModal({
            //   content: '报名失败，请刷新重试',
            //   confirmColor: '#a5673f',
            //   complete: res => {
            //     console.log(res)
            //     if (res.confirm) {
            //       console.log("用户确认")
            //     }
            //   }
            // })
    //       }
    //     })
    //     // return true
    //   }else{
    //     console.log('满了')
    //     wx.showModal({
    //       content: '人员已满',
    //       confirmColor: '#a5673f',
    //       complete: res => {
    //         console.log(res)
    //         if (res.confirm) {
    //           console.log("用户确认")
    //         }
    //       }
    //     })
    //   }
    //   console.log('末尾')
    //   // return false
    // })
  },
  getWork(e) {
    console.log(e.currentTarget.dataset)
    var limit = e.currentTarget.dataset.count
    console.log(limit)
    console.log('OK')
    work = 'information_desk'
    if (!work) {
      wx.showToast({
        title: '请选择',
        icon: 'none'
      })
      return
    }
    wx.requestSubscribeMessage({
      tmplIds: ['_Vs_yfS8lXCqxQgmtggpFbYTVJtMO2m1bxIyFqBoaro'],
      success: res => {
        // console.log()
        var temp_flag = res._Vs_yfS8lXCqxQgmtggpFbYTVJtMO2m1bxIyFqBoaro
        if(temp_flag == 'accept'){
          console.log('订阅成功')
          console.log('开始调用')
          console.log(res)
          this.get_ticket(limit)
        }else{
          console.log('订阅失败')
          // console.log(err)
          wx.showModal({
            content: '请允许接收订阅消息',
            confirmColor: '#a5673f',
            complete: res => {
              console.log(res)
              if (res.confirm) {
                console.log("用户确认")
              }
            }
          })
        }

      },
      fail: err => {

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
              count:_.inc(-1),
              [member]: _.pull({
                openid:app.globalData.openid
              }),
              openid: _.pull(app.globalData.openid)
            }
          }).catch(err => {
            console.log(err)
          })
          this.setData({
            work: ''
          })
          work = ''

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'share') {
      if (!app.globalData.name) {
        wx.showLoading({
          title: '校验身份信息',
          mask:true,
        })
      }
    }
    wx.showLoading({
      title: '正在加载',
      mask:true,
    })
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
    this.setData({
      _id:_id
    })
    // for(var i=0;i<=1000;i++){
    //   console.log('压力测试第' + i + '次')
    //   this.get_ticket(50)
    // }
    // this.people_count(_id)
    // wx.showLoading({
    //   title: '校验身份信息',
    //   mask:true,
    // })
    wx.hideLoading({
      success: (res) => {
        console.log('加载成功')
      },
    })
  },

  test_hasWork(onduty) {

    var openid = app.globalData.openid
    var information_desk = onduty.information_desk.member
    var array = [information_desk]
    console.log(array)
    for (var i in array[0]) {
      console.log(array[0][i].openid)
      if(array[0][i].openid == openid){
        work = 'information_desk'
        this.setData({
          work: work
        })
      }
      // if(array[i].openid == openid){
      //   work = 'information_desk'
      //   this.setData({
      //     work: work
      //   })
      // }
      // for (var j in array[i]) {
      //   if (key == array[i][j]) {
      //     if (i == 0) {
      //       work = 'information_desk'
      //       this.setData({
      //         work: work
      //       })
      //     }
      //   }
      // }
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