const $ = new Env('4K 电影')
$._4k_retryCnt = ($.getdata('_4k_retryCnt') || '10') * 1
$._4k_retryInterval = ($.getdata('_4k_retryInterval') || '500') * 1
$._4k_data = {}

!(async () => {
    $.log('', `🔔 ${$.name}, 开始!`, '')
    await signweb()
    await showmsg()
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.msg($.name, $.subt, $.desc), $.log('', `🔔 ${$.name}, 结束!`, ''), $.done()
    })

async function signweb() {
    for (let signIdx = 0; signIdx < $._4k_retryCnt; signIdx++) {
        await new Promise((resove) => {
            const url = {
                url: `https://www.hao4k.cn//plugin.php?id=k_misign:sign&operation=qiandao&formhash=b12b927a&format=empty&inajax=1&ajaxtarget=JD_sign`,
                headers: {}
            }
            url.headers['Cookie'] = 'HxHg_2132_saltkey=B8zu3i3z;HxHg_2132_auth=0dd1TWYNqJLei4AUhFMJ3pRiZ5%2FoZb7xjSN1YzB5hcKtjO2Iz5AxXL5PaShS8XXYiEtGTEoUOU6t6JAG50yrr5mQras'
            url.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'
            $.get(url, (error, response, data) => {
                try {
                    $._4k_data = data;
                    $.isWebSuc = true;
                    $.log(`[Web] 第 ${signIdx + 1} 次: ${data}`)
                } catch (e) {
                    $.isWebSuc = false
                    $.log(`❗️ ${$.name}, 执行失败!`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, '')
                } finally {
                    resove()
                }
            })
        })
        await new Promise($.wait($._4k_retryInterval))
        if ($.signSuc) break
    }
}

function showmsg() {
    return new Promise((resove) => {
        if (JSON.stringify($._4k_data).indexOf('<![CDATA[]]>') > 0) {
            $.subt = '签到成功';
        } else if (JSON.stringify($._4k_data).indexOf('<![CDATA[½ñÈÕÒÑÇ©]]>') > 0) {
            $.subt = '无需重复签到';
        } else {
            $.subt = '签到异常';
        }
        $.desc = $._4k_data.toString();
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
