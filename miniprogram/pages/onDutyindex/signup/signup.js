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
    _id: '',
    work: '',
    onduty: {},
    mywork: [0, 0, 0, 0, 0, 0],
    dlDisabled: false,
    dormitoryLimit: true,
    dormitories: [
      '未选择宿舍',
      '南区1号楼',
'南区2号楼',
'南区3号楼',
'南区4号楼',
'南区5号楼',
'南区6号楼',
'南区7号楼',
'南区8号楼',
'南区9号楼',
'南区10号楼',
'南区11号楼',
'南区12号楼',
'南区13号楼',
'南区14号楼',
'南区15号楼',
'南区16号楼',
'南区17号楼',
'南区18号楼',
'南区19号楼',
'南区20号楼',
'南区21号楼',
'南区22号楼',
'南区23号楼',
'南区24号楼',
'南区25号楼',
'南区26号楼',
'南区27号楼',
'南区28号楼',
'南区29号楼',
'南区30号楼',
'南区31号楼',
'南区32号楼',
'南区33号楼',
'南区34号楼',
'南区35号楼',
'南区36号楼',
'南区37号楼',
'紫荆1号楼',
'紫荆2号楼',
'紫荆3号楼',
'紫荆4号楼',
'紫荆5号楼',
'紫荆6号楼',
'紫荆7号楼',
'紫荆8号楼',
'紫荆9号楼',
'紫荆10号楼',
'紫荆11号楼',
'紫荆12号楼',
'紫荆13号楼',
'紫荆14号楼',
'紫荆15号楼',
'紫荆16号楼',
'紫荆17号楼',
'紫荆18号楼',
'紫荆19号楼',
'紫荆20号楼',
'紫荆21号楼',
'紫荆22号楼',
'紫荆23号楼',
'双清公寓北楼',
'双清公寓南楼',
      '其它',
    ]
  },

  people_count(_id) {
    db.collection("onDuty").where({
      _id: _id
    }).orderBy('submit_time', 'desc').field({
      count: true,
      information_desk: true
    }).get().then(res => {
      console.log(res.data[0].count, res.data[0].information_desk.limit)
      if (res.data[0].count < res.data[0].information_desk.limit) {
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
  get_ticket(limit) {
    var member = work + '.member'
    var openid = app.globalData.openid
    var nickname = app.globalData.name
    var stuid = app.globalData.stuid
    var phone = app.globalData.phone
    var college = app.globalData.college // dl
    var dormitory = app.globalData.dormitory // dl
    var sfid = app.globalData.sfid // ssd 
    var that = this
    var submit_time = new Date().getTime()
    console.log('到这里')
    db.collection('onDuty').where({
      _id: _id,
      count: _.lt(limit)
    }).update({
      data: {
        count: _.inc(1),
        [member]: _.push({
          openid,
          nickname,
          stuid,
          phone,
          college,
          dormitory,
          sfid,
          submit_time
        }),
        openid: _.addToSet(app.globalData.openid)
      }
    }).then(function (d) {
      if (d.stats.updated > 0) {
        /*抢购成功*/
        console.log('成功')
        wx.hideLoading({
          success: (res) => {
            console.log('报名成功hideloading')
          },
        })
        wx.showModal({
          content: '报名成功，请关注后续通知',
          confirmColor: '#9962F9',
          complete: res => {
            console.log(res)
            if (res.confirm) {
              console.log("用户确认")
            }
          }
        })
      } else {
        /*抢购失败*/
        console.log('抢失败')
        wx.hideLoading({
          success: (res) => {
            console.log('报名失败hideloading')
          },
        })
        wx.showModal({
          content: '报名失败，请刷新重试',
          confirmColor: '#9962F9',
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
    //   confirmColor: '#9962F9',
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
    //   confirmColor: '#9962F9',
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
    //       confirmColor: '#9962F9',
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
    this.setData({
      dlDisabled: true
    })
    console.log(e.currentTarget.dataset)
    var limit = e.currentTarget.dataset.count
    console.log(limit)
    work = 'information_desk'
    // if (!work) {
    //   wx.showToast({
    //     title: '请选择',
    //     icon: 'none'
    //   })
    //   return
    // }
    wx.requestSubscribeMessage({
      // tmplIds: ['_Vs_yfS8lXCqxQgmtggpFbYTVJtMO2m1bxIyFqBoaro'],
      tmplIds: ['l3D7T-LTfRoxXvjjBZ3afLvc6GnhcVwecG_9fZ5oZyE'],
      success: res => {
        // console.log()
        console.log(res)
        // var temp_flag = res.l3D7T-LTfRoxXvjjBZ3afLvc6GnhcVwecG_9fZ5oZyE
        var temp_flag = res['l3D7T-LTfRoxXvjjBZ3afLvc6GnhcVwecG_9fZ5oZyE']
        if (temp_flag == 'accept') {
          console.log('订阅成功')
          console.log('开始调用')
          console.log(res)
          wx.showLoading({
            title: '正在报名',
            mask: true,
          })
          this.get_ticket(limit)
        } else {
          console.log('订阅失败')
          // console.log(err)
          this.setData({
            dlDisabled: false
          })
          wx.showModal({
            content: '请允许接收订阅消息',
            confirmColor: '#9962F9',
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
        this.setData({
          dlDisabled: false
        })
      }
    })

  },

  resetWork() {
    wx.showModal({
      content: '重新选择可能会导致现有岗位被其他志愿者申请哦，是否重新选择',
      confirmColor: '#9962F9',
      complete: res => {
        console.log(res)
        if (res.confirm) {
          var member = work + '.member'
          onDuty.doc(_id).update({
            data: {
              count: _.inc(-1),
              [member]: _.pull({
                openid: app.globalData.openid
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
          mask: true,
        })
      }
    }
    wx.showLoading({
      title: '正在加载',
      mask: true,
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
        // 判断宿舍楼
        if(onduty.dormitory==0||onduty.dormitory==app.globalData.dormitory){
          that.setData({
            dormitoryLimit: false
          })
        }
        wx.hideLoading({
          success: (res) => {
            console.log('加载成功')
          },
        })
        if (!onduty.progress) {
          wx.redirectTo({
            url: '/pages/onDutyindex/onDutyindex',
          })
          wx.showToast({
            title: '报名已结束',
            icon: 'none'
          })
        }
      },
      onError: function (err) {
        console.error('the watch closed because of error', err)
      }
    })
    this.setData({
      _id: _id
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

  },

  test_hasWork(onduty) {
    var openid = app.globalData.openid
    var information_desk = onduty.information_desk.member
    var array = [information_desk]
    console.log(array)
    for (var i in array[0]) {
      console.log(array[0][i].openid)
      if (array[0][i].openid == openid) {
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