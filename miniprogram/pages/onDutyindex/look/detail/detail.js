var _id
const app = getApp()
const db = wx.cloud.database()
const onDuty = db.collection("onDuty")
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    captain:false,
    degs: [0, 0, 0, 0, 0, 0],
    tags: [],
    onduty: {},
    modalName: null,
    value: ''
  },

  delettag(e) {
    console.log(e)
    var member = e.currentTarget.dataset.work + '.member'
    console.log(e.currentTarget.dataset)
    onDuty.doc(_id).update({
      data: {
        [member]: _.pull(e.currentTarget.dataset.name),
        count:_.inc(-1)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  add_member(e) {
    console.log(e)
    var member = e.currentTarget.dataset.work + '.member'
    var openid = Math.random().toString(36).substring(2)
    var nickname = e.detail.value
    var stuid = '手动添加'
    var phone = '手动添加'
    var submit_time = new Date()
    onDuty.doc(_id).update({
      data: {
        count:_.inc(1),
        // [member]: _.addToSet(add_userinfo)
        [member]: _.push({openid,nickname,stuid,phone,submit_time})
      }
    }).catch(err => {
      console.log(err)
    })
  },
  rotateAnim: function (event) {
    //  console.log(event.currentTarget.dataset.id)
    let deg = this.data.degs[event.currentTarget.dataset.id];
    deg = deg == 0 ? 90 : 0;
    this.setData({
      ['degs[' + event.currentTarget.dataset.id + ']']: deg
    })
  },
  sendone(nickname,openid,stuid) {
    // var timegang=this.data.onduty.date,
    // timegang = timegang.replace(/(-)/, '年');
    // timegang = timegang.replace(/(-)/, '月');
    // timegang = timegang + '日'
    wx.cloud.callFunction({
      name: "send",
      data: {
        touser: openid,
        page:"pages/onDutyindex/look/detail/detail?_id="+_id,
        name1: nickname,
        number:stuid,
        time:this.data.onduty.date,
      },
      success(res) {
        console.log("成功", res);
      },
      fail(res) {
        console.log("推送失败", res)
      }
    })
  },
  reopen() {
    console.log('reopen')
    onDuty.doc(_id).update({
      data: {
        progress: true
      }
    }).catch(err => {
      console.log(err)
    })
  },

  finish() {
    wx.showModal({
      content: '结束报名将推送通知给队员（只能一次）',
      confirmText: '确定通知',
      cancelText: '我再想想',
      confirmColor: '#a5673f',
      complete: res0 => {
        console.log('完成1')
        console.log(res0.confirm)
        if (res0.confirm) {
          onDuty.doc(_id).update({
            data: {
              progress: false
            }
          }).catch(err => {
            console.log(err)
          })
          console.log('调用到这里了1231232')
          onDuty.doc(_id).get().then(ssd => {
            console.log(ssd.data.information_desk.member);
            ssd.data.information_desk.member.forEach(element =>{
              console.log(element.nickname,element.openid)
              this.sendone(element.nickname,element.openid,element.stuid)
            })
            // ssd.data.openid.forEach(element => {
            //   console.log('调用到这里了')
            //   this.sendone(element)
            // });
          })

        } else if (res0.cancel) {}
      }
    })

  },

  excel() {
    var that = this
    wx.showLoading({
      title: '生成中..'
    })

    wx.cloud.callFunction({
      name: "excel",
      data: {
        _id: _id
      },
      success(res) {
        console.log(res)
        wx.hideLoading()
        wx.showModal({
          content: '请选择保存方式',
          confirmText: '复制地址',
          confirmColor: '#a5673f',
          cancelText: '保存本地',
          complete: res0 => {
            if (res0.confirm) {
              that.getFileUrl(res.result.fileID)
            } else if (res0.cancel) {
              that.download(res.result.fileID)
            }
          }
        })
      },
      fail(res) {
        console.log("读取失败", res)
      }
    })
  },

  download(fileID) {
    wx.cloud.downloadFile({
      fileID: fileID,
      success: res1 => {

        wx.saveFile({
          tempFilePath: res1.tempFilePath,
          success(res2) {

            wx.showModal({
              content: '已保存在本地' + res2.savedFilePath + '目录下,是否现在打开',
              confirmColor: '#a5673f',
              complete: res3 => {
                if (res3.confirm) {

                  wx.openDocument({
                    filePath: res2.savedFilePath,
                    showMenu: true,
                    success: function () {
                      console.log('打开文档成功')
                    }
                  })
                }
              }
            })
          }
        })
      },
      fail: err => {
        // handle error
      }
    })
  },

  //获取云存储文件下载地址，这个地址有效期一天
  getFileUrl(fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        // get temp file URL
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl: res.fileList[0].tempFileURL
        })
        that.copyFileUrl()
      },
      fail: err => {
        // handle error
      }
    })
  },

  //复制excel文件下载链接
  copyFileUrl() {
    let that = this
    wx.setClipboardData({
      data: that.data.fileUrl,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log("复制成功", res.data) // data
            wx.showToast({
              title: '已复制在剪贴板',
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _id = options._id
    var that = this
    this.setData({
      captain:app.globalData.captain
    })
    onDuty.doc(_id).watch({
      onChange: function (snapshot) {
        console.log('snapshot', snapshot)
        var onduty = snapshot.docChanges[0].doc
        that.setData({
          onduty: onduty,
          value: ''
        })
      },
      onError: function (err) {
        console.error('the watch closed because of error', err)
      }
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
        title: this.data.onduty.date+"日报班任务",
        path: 'pages/onDutyindex/signup/signup?_id=' + _id+'&type=share'
      }
    }
  }
})