const $ = new Env('叮咚买菜')
$._DingDong_retryCnt = 3
$._DingDong_retryInterval = 2000
$._DingDong_session = JSON.parse($.getdata('chavy_cookie_dingdong'))
$._DingDong_result = {}

!(async () => {
    $.log('', `🔔 ${$.name}, 开始!`, '')
    await sign_point()
    await show_msg()
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.msg($.name, $.subt, $.desc), $.log('', `🔔 ${$.name}, 结束!`, ''), $.done()
    })

async function sign_point() {
    if (!$._DingDong_session) {
        $._DingDong_result.code = 9007
        return
    }
    for (let signIdx = 0; signIdx < $._DingDong_retryCnt; signIdx++) {
        await new Promise((resove) => {
            const url = {
                url: 'https://sunquan.api.ddxq.mobi/api/v2/user/signin/',
                headers: {}
            }
            url.headers['Cookie'] = $._DingDong_session.headers.Cookie.toString()
            url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 xzone/9.18.2 station_id/5c88b7a4716de1f6468b4573'
            $.post(url, (error, response, data) => {
                $.log(`${$.name} response data: ${data}`)
                try {
                    $._DingDong_result = JSON.parse(data);
                    $.signSuc = $._DingDong_result.code === 0
                    $.log(`[${$.name}] 第 ${signIdx + 1} 次: ${data}`)
                } catch (e) {
                    $.signSuc = false
                    $.log(`❗️ ${$.name}, 执行失败!`, ` error = ${error || e}`, `response = ${response.toString()}`, '')
                } finally {
                    resove()
                }
            })
        })
        await new Promise($.wait($._DingDong_retryInterval))
        if ($.signSuc) break
    }
}

function show_msg() {
    return new Promise((resove) => {
        if ($._DingDong_result.code == 0) {
            $.subt = '签到成功';
            $.desc = `连续签到【${$._DingDong_result.data.new_sign_series}天】，本次增加【${$._DingDong_result.data.point}积分】，最长连续签到【${$._DingDong_result.data.sign_series}天】`;
        } else if ($._DingDong_result.code == 9007) {
            $.subt = '登录信息失效';
            $.desc = `登录后，点击签到即可重新获取会话信息`;
        } else {
            $.subt = '签到失败';
            $.desc = JSON.stringify($._DingDong_result);
        }
        resove()
    })
}

// prettier-ignore
function Env(s) {
    this.name = s, this.data = null, this.logs = [], this.isSurge = (() => "undefined" != typeof $httpClient), this.isQuanX = (() => "undefined" != typeof $task), this.isNode = (() => "undefined" != typeof module && !!module.exports), this.log = ((...s) => {
        this.logs = [...this.logs, ...s], s ? console.log(s.join("\n")) : console.log(this.logs.join("\n"))
    }), this.msg = ((s = this.name, t = "", i = "") => {
        this.isSurge() && $notification.post(s, t, i), this.isQuanX() && $notify(s, t, i);
        const e = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
        s && e.push(s), t && e.push(t), i && e.push(i), console.log(e.join("\n"))
    }), this.getdata = (s => {
        if (this.isSurge()) return $persistentStore.read(s);
        if (this.isQuanX()) return $prefs.valueForKey(s);
        if (this.isNode()) {
            const t = "box.dat";
            return this.fs = this.fs ? this.fs : require("fs"), this.fs.existsSync(t) ? (this.data = JSON.parse(this.fs.readFileSync(t)), this.data[s]) : null
        }
    }), this.setdata = ((s, t) => {
        if (this.isSurge()) return $persistentStore.write(s, t);
        if (this.isQuanX()) return $prefs.setValueForKey(s, t);
        if (this.isNode()) {
            const i = "box.dat";
            return this.fs = this.fs ? this.fs : require("fs"), !!this.fs.existsSync(i) && (this.data = JSON.parse(this.fs.readFileSync(i)), this.data[t] = s, this.fs.writeFileSync(i, JSON.stringify(this.data)), !0)
        }
    }), this.wait = ((s, t = s) => i => setTimeout(() => i(), Math.floor(Math.random() * (t - s + 1) + s))), this.get = ((s, t) => this.send(s, "GET", t)), this.post = ((s, t) => this.send(s, "POST", t)), this.send = ((s, t, i) => {
        if (this.isSurge()) {
            const e = "POST" == t ? $httpClient.post : $httpClient.get;
            e(s, (s, t, e) => {
                t && (t.body = e, t.statusCode = t.status), i(s, t, e)
            })
        }
        this.isQuanX() && (s.method = t, $task.fetch(s).then(s => {
            s.status = s.statusCode, i(null, s, s.body)
        }, s => i(s.error, s, s))), this.isNode() && (this.request = this.request ? this.request : require("request"), s.method = t, s.gzip = !0, this.request(s, (s, t, e) => {
            t && (t.status = t.statusCode), i(null, t, e)
        }))
    }), this.done = ((s = {}) => this.isNode() ? null : $done(s))
}
