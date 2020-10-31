/*
  joyo在内网的时候有自己的NDS服务器，且如果使用外网DNS服务器解析出服务器IP在内网中无法访问；
  那么只能在内网的时候使用自建DNS服务器获取服务IP，在外网的时候使用公网DNS服务器获取服务IP。
*/

var joyo_dns_servers = ['172.31.1.125','172.31.1.126'];

if ($network.wifi.ssid === 'jymesh' || $network.wifi.ssid === 'jymesh_5G' 
	|| $network.wifi.ssid === 'jysmart' || $network.wifi.ssid === 'jysmart_5G'
	|| $network.wifi.ssid === 'jy_m') {
	$done({servers:joyo_dns_servers})
} else {
	$done({})
}
