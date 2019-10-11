(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{261:function(s,t,a){s.exports=a.p+"assets/img/harbor_1.c044e120.png"},262:function(s,t,a){s.exports=a.p+"assets/img/harbor_2.29c580cc.png"},263:function(s,t,a){s.exports=a.p+"assets/img/harbor_3.c934fefa.png"},264:function(s,t,a){s.exports=a.p+"assets/img/harbor_4.0c17525b.png"},368:function(s,t,a){"use strict";a.r(t);var e=a(2),n=Object(e.a)({},function(){var s=this,t=s.$createElement,e=s._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("h1",{attrs:{id:"harbor"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#harbor","aria-hidden":"true"}},[s._v("#")]),s._v(" Harbor")]),s._v(" "),e("blockquote",[e("p",[s._v("Harbor 是 VMware 公司开源的企业级的 Docker Registry 管理项目，可用于公私有镜像的存储和管理。作为一个企业级私有 Registry 服务器，Harbor 提供了更好的性能和安全，并提升用户使用 Registry 构建和运行环境传输镜像的效率。")])]),s._v(" "),e("h2",{attrs:{id:"前言"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#前言","aria-hidden":"true"}},[s._v("#")]),s._v(" 前言")]),s._v(" "),e("p",[s._v("Docker 官方提供 Docker Hub 来管理开源镜像，但在现实工作中，需要存储诸多企业内部镜像，当然可以通过购买 Docker Hub 上私有镜像来解决，也可以自建 Harbor 来管理企业内部镜像。")]),s._v(" "),e("p",[s._v("本篇目仅为 Harbor 搭建指引，基于 CentOS7 系统的云服务器为 1CPU 及 2G内存。")]),s._v(" "),e("h2",{attrs:{id:"环境"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#环境","aria-hidden":"true"}},[s._v("#")]),s._v(" 环境")]),s._v(" "),e("p",[s._v("因 Harbor 基于 Docker ，需要在镜像服务器配置相应的环境。以 CentOS7 系统为例，配置如下：")]),s._v(" "),e("ol",[e("li",[e("p",[s._v("安装 Docker")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Install required packages")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" yum "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" -y yum-utils device-mapper-persistent-data lvm2\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Set up the stable repository")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Install docker-ce")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" yum "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" docker-ce\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Enable docker")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" systemctl "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("enable")]),s._v(" docker\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Start Docker")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" systemctl start docker\n")])])])]),s._v(" "),e("li",[e("p",[s._v("安装 Docker Compose")]),s._v(" "),e("p",[s._v("因 Drone 由 drone-ui 、drone-agent 和 drone-server 三个服务组合，每个服务都是独立的容器，此时需要 Docker Compose 来编排多容器应用。")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Download the current stable release of Docker Compose")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" -L "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"https://github.com/docker/compose/releases/download/1.24.0/docker-compose-'),e("span",{pre:!0,attrs:{class:"token variable"}},[e("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$(")]),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("uname")]),s._v(" -s"),e("span",{pre:!0,attrs:{class:"token variable"}},[s._v(")")])]),s._v("-"),e("span",{pre:!0,attrs:{class:"token variable"}},[e("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$(")]),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("uname")]),s._v(" -m"),e("span",{pre:!0,attrs:{class:"token variable"}},[s._v(")")])]),s._v('"')]),s._v(" -o /usr/local/bin/docker-compose\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Apply executable permissions")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("chmod")]),s._v(" +x /usr/local/bin/docker-compose\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Link your path")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("ln")]),s._v(" -s /usr/local/bin/docker-compose /usr/bin/docker-compose\n")])])])])]),s._v(" "),e("h2",{attrs:{id:"安装包"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#安装包","aria-hidden":"true"}},[s._v("#")]),s._v(" 安装包")]),s._v(" "),e("p",[s._v("从 Harbor Github 仓库 "),e("a",{attrs:{href:"https://github.com/goharbor/harbor/releases",target:"_blank",rel:"noopener noreferrer"}},[s._v("Releases"),e("OutboundLink")],1),s._v(" 下载对应版本的安装包，本文以最新 V1.8.1 版本为例：")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 安装 harbor 离线安装包")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("wget")]),s._v(" https://storage.googleapis.com/harbor-releases/release-1.8.0/harbor-offline-installer-v1.8.1.tgz\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 解压 harbor 离线安装包")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("tar")]),s._v(" xvf harbor-offline-installer-v1.8.1.tgz\n")])])]),e("h2",{attrs:{id:"配置"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#配置","aria-hidden":"true"}},[s._v("#")]),s._v(" 配置")]),s._v(" "),e("ol",[e("li",[s._v("进入解压后的 "),e("code",[s._v("harbor")]),s._v(" 文件夹")])]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[s._v("$ "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" harbor\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("ls")]),s._v("\ncommon  docker-compose.yml  harbor.v1.8.1.tar.gz  harbor.yml  install.sh  LICENSE  prepare\n")])])]),e("ol",{attrs:{start:"2"}},[e("li",[s._v("配置 SSL")])]),s._v(" "),e("p",[s._v("倘若不配置 HTTPS ，需要在 docker login harbor.snowball.site 时添加 --insecure-registry 选项至 Docker daemon 并重启相关服务")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[s._v("$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("mkdir")]),s._v(" cert "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" cert\n$ openssl req -sha256 -x509 -days "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("365")]),s._v(" -nodes -newkey rsa:4096 -keyout  harbor.snowball.site.key -out harbor.snowball.site.crt\n")])])]),e("ol",{attrs:{start:"3"}},[e("li",[s._v("修改 "),e("code",[s._v("harbor.yml")]),s._v(" 配置文件")])]),s._v(" "),e("div",{staticClass:"language-yaml extra-class"},[e("pre",{pre:!0,attrs:{class:"language-yaml"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 修改 hostname，变更为自己服务器域名或地址")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("hostname")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" harbor.snowball.site\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 开启 https")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# cert 和 key 需要自己生成")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("https")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n   "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("port")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("443")]),s._v("\n   "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("certificate")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" /root/cert/harbor.snowball.site.crt\n   "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("private_key")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" /root/cert/harbor.snowball.site.key\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 修改 harbor 初始化时 admin 密码")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("harbor_admin_password")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" harbor0618\n")])])]),e("ol",{attrs:{start:"4"}},[e("li",[s._v("在当前目录下启动 Harbor 服务")])]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 执行安装 shell 脚本")]),s._v("\n$ ./install.sh\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 出现如下成功提示即可在浏览器访问 Harbor 服务")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v(".\n✔ ----Harbor has been installed and started successfully.----\n\nNow you should be able to visit the admin portal at https://harbor.snowball.site. \nFor "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("more")]),s._v(" details, please visit https://github.com/goharbor/harbor "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v("\n")])])]),e("h2",{attrs:{id:"注意事项"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#注意事项","aria-hidden":"true"}},[s._v("#")]),s._v(" 注意事项")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("未配置 SSL 证书")]),s._v(" "),e("p",[s._v("倘若 Harbor 服务器未配置相应的 SSL 证书，而 Harbor 只能提供 http 服务，云服务器需要进行配置才能拉取及推送镜像。")]),s._v(" "),e("p",[s._v("在云服务器 CentOS7 系统文件 "),e("code",[s._v("/etc/docker/daemon.json")]),s._v(" 中增加配置项（ 倘若文件夹不存在则新建 ）：")]),s._v(" "),e("div",{staticClass:"language-json extra-class"},[e("pre",{pre:!0,attrs:{class:"language-json"}},[e("code",[e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),e("span",{pre:!0,attrs:{class:"token property"}},[s._v('"insecure-registries"')]),s._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n    "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"harbor.snowball.site"')]),s._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),e("p",[s._v("重启 Docker 服务：")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 以 root 权限运行")]),s._v("\n$ systemctl daemon-reload\n$ systemctl restart docker\n")])])]),e("p",[s._v("在本地 Mac OS 系统 Daemon Advanced 中需要进行如下配置：")]),s._v(" "),e("p",[e("img",{attrs:{src:a(261),alt:""}})]),s._v(" "),e("p",[s._v("配置完成后，需要点击下方的 Apply & Restart 按钮来使其生效。")])]),s._v(" "),e("li",[e("p",[s._v("SSL 不被信任")]),s._v(" "),e("p",[s._v("自签发的证书不会被 Chrome 等浏览器识别，此时可以采用 Let's Encrypt 生成免费的、可被浏览器信任的证书。")]),s._v(" "),e("p",[s._v("常用的 Let's Encrypt 生成工具主要有 "),e("a",{attrs:{href:"https://github.com/Neilpang/acme.sh",target:"_blank",rel:"noopener noreferrer"}},[s._v("acme.sh"),e("OutboundLink")],1),s._v(" 及 "),e("a",{attrs:{href:"https://github.com/certbot/certbot",target:"_blank",rel:"noopener noreferrer"}},[s._v("certbot"),e("OutboundLink")],1),s._v(" 两种。")]),s._v(" "),e("ul",[e("li",[s._v("acme.sh")])]),s._v(" "),e("p",[s._v("安装 acme.sh ，如下：")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 此命令做了如下两件事")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 把 acme.sh 安装到你的 home 目录下，即 ~/.acme.sh/")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 创建 一个 bash 的 alias, 方便你的使用: alias acme.sh=~/.acme.sh/acme.sh")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 自动为你创建 cronjob, 每天 0:00 点自动检测所有的证书, 如果快过期了, 需要更新, 则会自动更新证书")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v("  https://get.acme.sh "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("sh")]),s._v("\n")])])]),e("p",[s._v("生成 SSL 证书时需要注意，CentOS7 默认防火墙 firewalld 关闭了 http 服务，需要进行开启：")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 开启防护墙 http 服务并重启")]),s._v("\n$ firewall-cmd --zone"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("public --permanent --add-service"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("http\n$ firewall-cmd --reload\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看防护墙所有服务")]),s._v("\n$ firewall-cmd --list-service\n")])])]),e("p",[s._v("生成 SSL 证书：")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 生成证书需安装 socat")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" ~/.acme.sh/\n$ yum "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" socat\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("sh")]),s._v(" acme.sh  --issue -d harbor.snowball.site  --standalone\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 执行结果如下即表示成功")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:39 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Standalone mode.\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:40 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Single "),e("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("domain")]),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v("'harbor.snowball.site'")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:40 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Getting domain auth token "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" each domain\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:40 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Getting webroot "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("domain")]),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v("'harbor.snowball.site'")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:40 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Verifying: harbor.snowball.site\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:40 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Standalone mode server\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:44 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Success\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:44 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Verify finished, start to sign.\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:44 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Lets finalize the order, Le_OrderFinalize: https://acme-v02.api.letsencrypt.org/acme/finalize/59771251/599803099\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:46 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Download cert, Le_LinkCert: https://acme-v02.api.letsencrypt.org/acme/cert/03b0de0dcb959ed07587c8356c8764eb1464\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:46 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Cert success.\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v(".\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:46 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Your cert is "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v("  /root/.acme.sh/harbor.snowball.site/harbor.snowball.site.cer \n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:46 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" Your cert key is "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v("  /root/.acme.sh/harbor.snowball.site/harbor.snowball.site.key \n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:46 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" The intermediate CA cert is "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v("  /root/.acme.sh/harbor.snowball.site/ca.cer \n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("年 06月 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("22")]),s._v("日 星期六 "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":04:46 UTC"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" And the full chain certs is there:  /root/.acme.sh/harbor.snowball.site/fullchain.cer \n")])])]),e("p",[s._v("尽量不要索引安装目录下的证书，复制证书至系统文件夹：")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 打开 /opt/ 文件夹并新建 certs 文件夹")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" /opt/ "),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("mkdir")]),s._v(" -p certs\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 使用 --installcert 命令指定目标文件夹位置")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" ~/.acme.sh/\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("sh")]),s._v(" acme.sh  --installcert  -d  harbor.snowball.site "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n      --key-file /opt/certs/harbor.snowball.site.key "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n      --fullchain-file /opt/certs/fullchain.cer\n")])])]),e("p",[s._v("修改 "),e("code",[s._v("harbor.yml")]),s._v(" 配置文件：")]),s._v(" "),e("div",{staticClass:"language-yaml extra-class"},[e("pre",{pre:!0,attrs:{class:"language-yaml"}},[e("code",[e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("https")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("port")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("443")]),s._v("\n "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("certificate")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" /opt/certs/fullchain.cer\n "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("private_key")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" /opt/certs/harbor.snowball.site.key\n")])])]),e("p",[s._v("重启 Harbor 服务：")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[s._v("$ "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" ~/harbor\n$ ./install.sh\n")])])]),e("ul",[e("li",[s._v("certbot")])]),s._v(" "),e("p",[s._v("拉取 certbot 至本地:")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[s._v("$ yum "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v("\n$ "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" clone https://github.com/certbot/certbot\n")])])]),e("p",[s._v("生成 SSL 证书：")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[s._v("$ "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" certbot\n$ ./letsencrypt-auto certonly -d harbor.snowball.site\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 执行结果如下即表示成功")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 授权方式选择 Spin up a temporary webserver (standalone)")]),s._v("\nIMPORTANT NOTES:\n- Congratulations"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v(" Your certificate and chain have been saved at:\n  /etc/letsencrypt/live/harbor.snowball.site/fullchain.pem\n  Your key "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("file")]),s._v(" has been saved at:\n  /etc/letsencrypt/live/harbor.snowball.site/privkey.pem\n  Your cert will expire on "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("2019")]),s._v("-09-20. To obtain a new or tweaked\n  version of this certificate "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" the future, simply run\n  letsencrypt-auto again. To non-interactively renew *all* of your\n  certificates, run "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"letsencrypt-auto renew"')]),s._v("\n- If you like Certbot, please consider supporting our work by:\n\n  Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate\n  Donating to EFF:                    https://eff.org/donate-le\n")])])]),e("p",[s._v("修改 "),e("code",[s._v("harbor.yml")]),s._v(" 配置文件：")]),s._v(" "),e("div",{staticClass:"language-yaml extra-class"},[e("pre",{pre:!0,attrs:{class:"language-yaml"}},[e("code",[e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("https")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("port")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("443")]),s._v("\n "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("certificate")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" /etc/letsencrypt/live/harbor.snowball.site/fullchain.pem\n "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("private_key")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" /etc/letsencrypt/live/harbor.snowball.site/privkey.pem\n")])])]),e("p",[s._v("重启 Harbor 服务：")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[s._v("$ "),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" ~/harbor\n$ ./install.sh\n")])])]),e("p",[s._v("certbot 并不支持证书自动续期的功能，需要手动添加，通过 "),e("code",[s._v("crontab -e")]),s._v(" 命令进入编辑，设置如下：")]),s._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token assign-left variable"}},[e("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("SHELL")])]),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/bin/bash\n"),e("span",{pre:!0,attrs:{class:"token assign-left variable"}},[e("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("PATH")])]),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/sbin:/bin:/usr/sbin:/usr/bin\n\n"),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" */2 * certbot renew --quiet --force-renewal\n")])])])]),s._v(" "),e("li",[e("p",[s._v("利用 Let's Encrypt 签发证书替换自签发证书后，SSL 证书认证成功依旧报错")]),s._v(" "),e("p",[e("img",{attrs:{src:a(262),alt:""}})]),s._v(" "),e("p",[s._v("从错误描述来看，与之前容许非安全模式下运行该网站有关，但多次强刷新依旧无效，此时需要清空该网站缓存，并重启浏览器使其生效：")]),s._v(" "),e("p",[e("img",{attrs:{src:a(263),alt:""}})]),s._v(" "),e("p",[s._v("重启浏览器之后，打开网站，SSL 完全生效，结果如下：")]),s._v(" "),e("p",[e("img",{attrs:{src:a(264),alt:""}})])])]),s._v(" "),e("h2",{attrs:{id:"参考链接"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#参考链接","aria-hidden":"true"}},[s._v("#")]),s._v(" 参考链接")]),s._v(" "),e("ul",[e("li",[e("p",[e("a",{attrs:{href:"https://www.vultr.com/docs/how-to-install-harbor-on-centos-7",target:"_blank",rel:"noopener noreferrer"}},[s._v("How to Install Harbor on CentOS 7"),e("OutboundLink")],1)])]),s._v(" "),e("li",[e("p",[e("a",{attrs:{href:"https://blog.csdn.net/aixiaoyang168/article/details/73549898",target:"_blank",rel:"noopener noreferrer"}},[s._v("Docker镜像仓库Harbor之搭建及配置"),e("OutboundLink")],1)])]),s._v(" "),e("li",[e("p",[e("a",{attrs:{href:"https://github.com/Neilpang/acme.sh/wiki/%E8%AF%B4%E6%98%8E",target:"_blank",rel:"noopener noreferrer"}},[s._v("acme.sh docs"),e("OutboundLink")],1)])]),s._v(" "),e("li",[e("p",[e("a",{attrs:{href:"https://blog.csdn.net/shasharoman/article/details/80915222",target:"_blank",rel:"noopener noreferrer"}},[s._v("Let's Encrypt证书自动更新"),e("OutboundLink")],1)])]),s._v(" "),e("li",[e("p",[e("a",{attrs:{href:"https://stackoverflow.com/questions/44145936/chrome-active-content-with-certificate-errors",target:"_blank",rel:"noopener noreferrer"}},[s._v("Chrome “Active content with certificate errors”"),e("OutboundLink")],1)])])])])},[],!1,null,null,null);t.default=n.exports}}]);