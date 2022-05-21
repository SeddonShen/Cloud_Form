// pages/info/info.js
var app = getApp();
Page({
    data: {
        name: '',
        college: 0,
        dormitory: 0,
        phone: '',
        stuid: '',
        sfid: '',
        flag: false,
        show: false,
        colleges: [
            "未选择",
            "材料学院",
            "出土文献研究与保护中心",
            "低碳能源实验室",
            "电机工程与应用电子技术系",
            "法学院",
            "高等研究院",
            "工程物理系",
            "公共管理学院",
            "航空发动机研究院",
            "航天航空学院",
            "核能与新能源技术研究院",
            "化学工程系",
            "环境学院",
            "机械工程学院",
            "建筑学院",
            "交叉信息研究院",
            "教育研究院",
            "经济管理学院",
            "理学院",
            "马克思主义学院",
            "美术学院",
            "脑与智能实验室",
            "全球创新学院",
            "求真书院",
            "人文学院",
            "日新书院",
            "社会科学学院",
            "深圳国际研究生院",
            "生命科学学院",
            "生物医学交叉研究院",
            "数学科学中心",
            "苏世民书院",
            "体育部",
            "土木水利学院",
            "探微书院",
            "万科公共卫生与健康学院",
            "未来实验室",
            "五道口金融学院",
            "未央书院",
            "新闻与传播学院",
            "新雅书院",
            "信息科学技术学院",
            "行健书院",
            "药学院",
            "医学院",
            "艺术教育中心",
            "语言教学中心",
            "智能产业研究院",
            "致理书院",
            "其他"
        ],
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
            '其它'
        ]
    },
    onLoad: function (options) {
        this.getUserInfo()
        this.getShowFlag()
    },

    getShowFlag() {
        let that = this
        let db = wx.cloud.database()
        let table = db.collection('show')
        table.get().then(res => {
            let show = res.data[0].show
            if (show) {
                that.setData({
                    show: true
                })
            } else {
                that.setData({
                    college: 1,
                    phone: '15945678900',
                    stuid: '2019300000',
                    sfid: '430421200011100091',
                    dormitory: 1
                })
            }
        })
    },

    toIndex() {
        wx.navigateTo({
            url: '/pages/onDutyindex/onDutyindex',
        })
    },

    /**
     * 更新用户信息 更新后会保存到storage
     */
    updateUserInfo() {
        if (!this.check()) {
            return
        } else {
            let that = this
            wx.showLoading({
                title: '更新中',
            })
            wx.cloud.callFunction({
                name: 'updateUserInfo',
                data: {
                    name: this.data.name,
                    college: this.data.college,
                    dormitory: this.data.dormitory,
                    phone: this.data.phone,
                    stuid: this.data.stuid,
                    sfid: this.data.sfid
                },
            }).then(function (res) {
                wx.showToast({
                    title: '信息上传成功',
                    icon: 'none'
                })
                that.setData({
                    flag: true
                })
                // that.storeUserInfo(res.result.result)
                wx.redirectTo({
                    url: '/pages/onDutyindex/onDutyindex',
                    success: (res) => {
                        console.log('跳转成功')
                    },
                    fail: (res) => {
                        console.log('跳转成功1')
                    },
                    complete: (res) => {
                        console.log('跳转成功2')
                    },
                })
            }).catch(e => {
                console.log(e)
                wx.showToast({
                    title: '信息上传错误',
                    icon: 'none'
                })
            })
        }
    },

    storeUserInfo(userInfo) {
        console.log('更新缓存')
        wx.setStorageSync('user', userInfo)
    },
    getUserInfoFromStorage() {
        return wx.getStorageSync('user')
    },
    /**
     * 获取用户信息，若缓存有 则不执行
     * 获取后，会用保存新数据
     */
    getUserInfo() {
        // let userInfo = this.getUserInfoFromStorage()
        // if (userInfo != '') {
        //     console.log('使用缓存')
        //     app.globalData = userInfo
        //     this.setData({
        //         name: userInfo.name,
        //         dormitory: userInfo.dormitory,
        //         college: userInfo.college,
        //         phone: userInfo.phone,
        //         stuid: userInfo.stuid,
        //         sfid: userInfo.sfid,
        //         flag: true
        //     })
        //     return
        // }
        let that = this
        wx.cloud.callFunction({
            name: 'getUserInfo',
        }).then(function (res) {
            let result = res.result
            if (result.flag) {
                if (result.data.dormitory == undefined) {
                    wx.showToast({
                        title: '请完善宿舍信息',
                        icon: 'none'
                    })
                }
                console.log(result)
                result.data['openid'] = result.data['_id']
                // that.storeUserInfo(result.data)
                app.globalData = result.data
                that.setData({
                    name: result.data.name,
                    college: result.data.college,
                    dormitory: result.data.dormitory,
                    phone: result.data.phone,
                    stuid: result.data.stuid,
                    sfid: result.data.sfid,
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

    /**
     * 检查需要输入的字段
     */
    check() {
        if (this.data.name == '' || this.data.college == 0 || this.data.dormitory == 0 || this.data.stuid == '') {
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
        } else if (!this.checkId(this.data.sfid) && !this.checkPasspoort(this.data.sfid)) {
            wx.showToast({
                title: '身份证/护照格式不正确',
                icon: 'none'
            })
            return false
        } else {
            return true
        }
    },

    /**
     * 检查护照号
     * 
     * @param {护照号} str 
     */
    checkPasspoort(str) {
        let re = /^1[45][0-9]{7}$|([P|p|S|s]\d{7}$)|([S|s|G|g|E|e]\d{8}$)|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|([H|h|M|m]\d{8,10})$/
        return re.test(str)
    },

    /**
     * 身份证检查
     * @param {*} id 
     */
    checkId(id) {
        // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
        var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
        //号码规则校验
        if (!format.test(id)) {
            return false
        }
        //区位码校验
        //出生年月日校验  前正则限制起始年份为1900;
        var year = id.substr(6, 4), //身份证年
            month = id.substr(10, 2), //身份证月
            date = id.substr(12, 2), //身份证日
            time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
            now_time = Date.parse(new Date()), //当前时间戳
            dates = (new Date(year, month, 0)).getDate(); //身份证当月天数
        if (time > now_time || date > dates) {
            return false
        }
        //校验码判断
        var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
        var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
        var id_array = id.split("");
        var sum = 0;
        for (var k = 0; k < 17; k++) {
            sum += parseInt(id_array[k]) * parseInt(c[k]);
        }
        if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
            return false
        }
        return true
    },

    /**
     * 检查手机号码格式
     * 
     * @param {*} str 
     */
    checkMobile(str) {
        var re = /^1\d{10}$/
        return re.test(str)
    },

    /**
     * 学院选择框
     * 
     * @param {*} e 
     */
    bindPickerChange: function (e) {
        this.setData({
            college: e.detail.value
        })
    },
    /**
     * 宿舍选择框
     * 
     * @param {*} e 
     */
    dormitoryChange: function (e) {
        this.setData({
            dormitory: e.detail.value
        })
    },

})