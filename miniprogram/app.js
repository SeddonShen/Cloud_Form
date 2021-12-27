// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }
    var that = this
    // team: app.globalData.group,
    // name: app.globalData.name,
    // captain: app.globalData.captain
    // wx.cloud.callFunction({
    //   name : 'login',
    //   success(res){
    //     console.log(res)
    //     that.globalData.openid = res.result.openid
    //   },
    // })
    // this.globalData = {
    //   group: '疫情防控志愿服务',
    //   name: '学生',
    //   captain: false,
    //   openid: 'oO4NG5WCH4deh3jpmgAQnrhjCK-Q',
    //   phone: '01234567890',
    //   stuid: '2019300000'
    // };
    // let userInfo = wx.getStorageSync('user')
    // if (userInfo != '') { // 若缓存中有用户信息
    //   console.log('使用缓存')
    //   this.globalData = userInfo
    // } else {
    //   wx.redirectTo({
    //     url: '/pages/info/info',
    //   })
    // }
    wx.showLoading({
      title: '加载信息中',
      mask: 'none'
    })
    wx.cloud.callFunction({
      name: 'getUserInfo',
    }).then(function (res) {
      let result = res.result
      wx.hideLoading()
      if (result.flag) {
        result.data['openid'] = result.data['_id']
        that.globalData = result.data
      } else {
        wx.redirectTo({
          url: '/pages/info/info'
        })
      }
    }).catch(e=>{
      wx.hideLoading()
    })
    wx.cloud.database().collection('notice')
      .where({
        flag: true
      })
      .field({
        text: true
      })
      .get().then(res => {
        let data = res.data
        if (data.length !== 0) {
          wx.showModal({
            title: '温馨提示',
            content: data[0].text,
            showCancel: false,
            confirmText: '我已知悉',
            confirmColor: '#ab0313',
          })
        }
      }).catch(e => {
        console.log(e)
      })
  }
});