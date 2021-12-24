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
    this.globalData = {
      group: '疫情防控志愿服务',
      name: '学生',
      captain: false,
      openid: 'oO4NG5WCH4deh3jpmgAQnrhjCK-Q',
      phone: '01234567890',
      stuid: '2019300000'
    };
  }
});