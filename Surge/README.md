
# 官方教程
https://manual.nssurge.com/


# 协议支持

* [曲线救国 - external 链式协议代理](https://community.nssurge.com/d/3-external-proxy-provider)

# max使用surge作为网关
* 网关
    - mac的IP地址
* DNS
    - 192.0.2.2 推荐这个新地址
    - 192.18.0.2 老地址，废弃了，不知道因为啥，反正用不了

# surge4的DHCP模式

## 配置方法
* surge.conf 需要配置 dns-server
* 路由器关闭DHCP：常用设置 => 局域网设置 => DHCP服务 => 关闭
* surge中设置：显示主窗口 设备 DHCP服务器 
    - 如果需要surge接管设备，那么需要右键 "使用surge作为网关"
    - "固定IP"：可以更方便的使用 "IP-CIDR" 等规则分流 

## 当前固定IP分配情况
* Apple家族
    - 192.169.31.31 Mac mini Ethernet
    - 192.168.31.32 Mac mini wifi 2.4G
    - 192.168.31.33 MacBook Pro 2.4G
    - 192.168.31.34 MacBook Pro 5G
    - 192.168.31.35 iPhone X 2.4G
    - 192.168.31.36 iPhone X 5G
    - 192.168.31.37 iPad 2.4G
    - 192.168.31.38 iPad 5G
* 小米家族
    - 192.168.31.41 小米电视
    - 192.168.31.43 小米音箱 2.4G 预留
    - 192.168.31.44 小米音箱 5G 