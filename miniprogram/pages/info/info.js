// pages/info/info.js
var app = getApp();
Page({

    data: {
        name: '',
        college: 0,
        phone: '',
        stuId: '',
        flag: false,
        colleges: [
            '未选择学院',
            '航空学院',
            '航天学院',
            '航海学院',
            '材料学院',
            '机电学院',
            '力学与土木建筑学院',
            '动力与能源学院',
            '电子信息学院',
            '自动化学院',
            '计算机学院',
            '数学与统计学院',
            '物理科学与技术学院',
            '化学与化工学院',
            '管理学院',
            '公共政策与管理学院',
            '软件学院',
            '生命学院',
            '外国语学院',
            '教育实验学院',
            '国际教育学院',
            '国家保密学院',
            '马克思主义学院',
            '西北工业大学伦敦玛丽女王大学工程学院',
            '微电子学院',
            '网络空间安全学院',
            '民航学院',
            '生态环境学院',
            '体育部',
            '无人系统技术研究院',
            '文化遗产研究院',
            '柔性电子研究院',
            '医学研究院',
            '光电与智能研究院',
            '其他'
        ]
    },
    onLoad: function (options) {
        this.getUserInfo()
    },

    toIndex(){
        wx.navigateTo({
          url: '/pages/onDutyindex/onDutyindex',
        })
    },

    updateUserInfo() {
        if (!this.check()) {
            return
        }
        else {
            let that = this
            wx.showLoading({
                title: '更新中',
            })
            wx.cloud.callFunction({
                name: 'updateUserInfo',
                data: {
                    name: this.data.name,
                    college: this.data.college,
                    phone: this.data.phone,
                    stuId: this.data.stuId,
                },
            }).then(function (res) {
                console.log(res)
                wx.showToast({
                    title: '信息上传成功',
                    icon: 'none'
                })
                that.getUserInfo()
            }).catch(e => {
                console.log(e)
                wx.showToast({
                    title: '信息上传错误',
                    icon: 'none'
                })
            })
        }
    },
    getUserInfo() {
        let that = this
        wx.cloud.callFunction({
                name: 'getUserInfo',
            }).then(function (res) {
                let result = res.result
                if (result.flag) {
                    console.log(result)
                    app.globalData = {
                        group: result.data.group,
                        name: result.data.name,
                        captain: result.data.captain,
                        openid: result.data._id,
                        phone: result.data.phone,
                        stuid: result.data.stuid
                      }
                    that.setData({
                        name: result.data.name,
                        college: result.data.college,
                        phone: result.data.phone,
                        stuId: result.data.stuId,
                        flag: true
                    })
                } else {
                    wx.showToast({
                        title: '未注册',
                        icon: 'none'
                    })
                    that.setData({
                        flag: false
                    })
                }
            })
            .catch(e => {
                console.log(e)
            })
    },

    check() {
        if (this.data.name == '' || this.data.college == 0 || this.data.stuId == '') {
            wx.showToast({
                title: '请完善信息',
                icon: 'none'
            })
            return false
        } else if (!this.checkMobile(this.data.phone)) {
            wx.showToast({
                title: '手机号格式不正确',
                icon: 'none'
            })
            return false
        } else {
            return true
        }
    },
    checkMobile(str) {
        var re = /^1\d{10}$/
        if (re.test(str)) {
            return true
        } else {
            return false
        }
    },

    bindPickerChange: function (e) {
        this.setData({
            college: e.detail.value
        })
    },

})