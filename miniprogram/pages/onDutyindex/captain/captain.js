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
    date: '2021-12-25',
    year:'',
    month:'',
    day:'',
    time_begin: '08:00',
    time_end:'12:00',
    imgList: [],
    captain:false,
    // datesend:'',

    place: '', // dl待输入的地点
    // expostor: 2,
    // hall_desk: 2,
    // teenager_learn: 2,
    // expose_robot: 2,
    // expostor_desk: 4,
    // interval: '上午',
    // interval_picker: ['上午', '下午' ,'晚上'],
    information_desk: 50,
    number: [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100],
    submit:false,
    // text_input:"志愿服务小贴士：四要四坚决 思想要高度重视、认识要清晰准确 行动要积极配合、防护要全面到位 坚决做到身体素质不胜任的绝不上岗 坚决做到岗位知识不熟悉的绝不上岗 坚决做到防护措施不到位的绝不上岗 坚决做到核酸阴性无证明的绝不上岗"
    text_input:"报名成功后请根据通知加入相关群聊"
  },

  submit(e) {
    wx.showLoading({
      title: '发布中..',
      mask: 'true'
    })
    console.log(e)
    var duty = {}
    var setDuty = e.detail.value

    // duty.expostor = {}
    duty.information_desk = {}
    // duty.expostor_desk = {}
    // duty.expose_robot = {}
    // duty.teenager_learn = {}
    // duty.hall_desk = {}
    // duty.interval = setDuty.interval
    duty.date = setDuty.date
    // 处理date默认时无datesend的问题
    // let realDateSend = this.data.datesend
    // if(realDateSend==''){
    //   let datesend = new Date(this.data.date)
    //   let month = datesend.getMonth() + 1
    //   realDateSend = datesend.getFullYear()+ '年' + month + '月' + datesend.getDate() + '日'
    // }
    // duty.datesend = realDateSend
    let datesend = new Date(this.data.date)
    let month = datesend.getMonth() + 1
    duty.datesend = datesend.getFullYear()+ '年' + month + '月' + datesend.getDate() + '日'
    
    duty.team = app.globalData.group

    duty.place = this.data.place // dl
    
    duty.time_begin = this.data.time_begin
    duty.time_end = this.data.time_end
    duty.submit_time = util.formatTime(new Date())
    duty.progress = true

    // duty.expostor.limit = setDuty.expostor
    duty.information_desk.limit = setDuty.information_desk
    // duty.expostor_desk.limit = setDuty.expostor_desk
    // duty.expose_robot.limit = setDuty.expose_robot
    // duty.teenager_learn.limit = setDuty.teenager_learn
    // duty.hall_desk.limit = setDuty.hall_desk

    // duty.expostor.member = []
    duty.information_desk.member = []
    // duty.expostor_desk.member = []
    // duty.expose_robot.member = []
    // duty.teenager_learn.member = []
    // duty.hall_desk.member = []
    duty.openid = []
    duty.count = 0
    duty.notice = this.data.text_input 
    duty.imgList = this.data.imgList
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

  textareaAInput(e) {
    this.setData({
      text_input: e.detail.value
    })
  },

  information_deskChange(e) {
    this.setData({
      information_desk: parseInt(e.detail.value)
    })
  },

  // intervalChange(e) {
  //   this.setData({
  //     interval: this.data.interval_picker[e.detail.value],
  //     expostor_desk: e.detail.value == 0 ? 4 : 2
  //   })
  // },

  dateChange(e) {
    // var datesend = new Date(e.detail.value)
    // var month = datesend.getMonth() + 1
    // var datesend_temp = datesend.getFullYear()+ '年' + month + '月' + datesend.getDate() + '日'
    this.setData({
      date: e.detail.value,
      // datesend:datesend_temp
    })
    
    // console.log(datesend.getFullYear(),datesend.getMonth()+1,datesend.getDate())
    // console.log(new Date(e.detail.value))
  },
  TimeChange(e) {
    console.log(e)
    if(e.currentTarget.dataset.pickertype == 'begin'){
      this.setData({
        time_begin: e.detail.value
      })
    }else{
      this.setData({
        time_end: e.detail.value
      })
    }

  },
  ChooseImage() {
    var that = this
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        wx.showLoading({
          title: '上传图片中..',
          mask: 'true'
        })
        wx.cloud.uploadFile({
          cloudPath: util.formatName(new Date()),
          filePath: res.tempFilePaths[0], // 文件路径
          success: res => {
            console.log("图片上传成功")
            console.log(res.fileID)
            console.log(that.data.imgList.length)
            if (that.data.imgList.length != 0) {
              that.setData({
                imgList: that.data.imgList.concat(res.fileID)
              })
            } else {
              console.log('NB')
              that.setData({
                imgList: res.fileID
              })
            }
            // console.log(num)
          },
          fail: err => {
            // handle error
            wx.showModal({
              title: '温馨提示',
              content: '图片上传失败，请联系管理员',
              cancelText: '取消',
              confirmText: '确认',
              success: res => {
              }
            })
          }
        })
        wx.hideLoading({
          success: (res) => {
            wx.showModal({
              title: '图片上传成功！',
              confirmText: "好的",
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //点击确定按钮
                } else if (res.cancel) {
                  //点击取消按钮
                }
              }
            })
          },
        })
      }
    });
  },
  ViewImage(e) {
    var urls = [this.data.imgList] 
    wx.previewImage({
      urls: urls
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '温馨提示',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          // this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: []
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = util.pickerData(new Date())
    this.setData({
      date: date,
      captain:app.globalData.captain
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