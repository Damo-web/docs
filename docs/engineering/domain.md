# Domain

> 域名是由一串用点分隔的字符组成的互联网上某一台计算机或计算机组的名称，用于在数据传输时标识计算机的电子方位。

## 前言

网站通常不会给用户仅提供 IP 地址来访问，常规 IPv4 地址示例为 144.202.103.102 ，要记忆它十分困难，但记住 doc.snowball.site 等域名会容易很多。只需记住语义化的域名，而不需要记住一长串难记的数字，会让网站的可访问性提升。

## 域名构成

域名的核心是域名系统 ( Domain Name System，简称 DNS )，域名系统中的任何名称都是域名。

域名主要分为根域名（ root domain ）、顶级域名（ top-level domain，简称 TLD ）和子域名（ sub-level domain ）三大部分。根域名，通常省略，例如 <code>www.google.com.root</code> ，常简写为 <code>www.google.com.</code> ；顶级域名，也可称为一级域名，通常为了表明该域名使用目的（ 例如 .com 、.net 、.org 及 .cn 等 ）；子域名包含除了根域名及顶级域名外的域名部分，一级一级往下，可分为三级域名、四级域名等，用以细分域名及提供多元服务。

网络链接通常构成如下：

![](./img/domain_1.png)

如上所示，顶级域名即为 <code>.com</code> ，二级域名为 <code>google.com</code>，三级域名为 <code>www.google.com</code>。

当购买域名时，其实是购买一个二级域名( second-level domain，缩写为 SLD )的使用权限（ 例如 snowball.site ），可以基于此域名来扩展三级域名及四级域名。

## 域名注册

在上文中，我们概览了域名基础知识及层级结构，那我们如何购买域名（ 注册域名 ）呢？

域名的注册由域名注册商来提供，常见的域名注册商有 [Godaddy](https://sg.godaddy.com/zh)、[NameSilo](https://www.namesilo.com/)、[Name](https://www.name.com/zh-cn/)、[万网](https://wanwang.aliyun.com/domain/)、[新网](http://www.xinnet.com/)等。需要注意的是，阿里云采用**万网**来注册域名，腾讯云采用**新网**来注册域名。

至于如何选择域名注册商，还是要看建站的实际需求。倘若仅仅是个人站点，只关注国内可访问性，为避免备案的烦恼，可以选用国外的域名注册商；倘若是商业性的国内网站，可以选用国内的域名注册商。总之，域名注册商的选择还是看网站具体用途。

下面以 Godaddy 为例，演示域名注册的大致流程：

- 访问 [Godaddy](https://sg.godaddy.com/zh) 官网，注册个人账号

- 在 Godaddy 官网中搜索相应域名，添加域名进入购物车，如下：

  ![](./img/domain_2.png)

- 进入购物车页面，完成域名购买：
  
  ![](./img/domain_3.png)

## 域名解析

完成域名购买后，就拥有了域名的使用权。倘若需要将域名应用到网站，需要进行域名解析。

域名解析通俗点来讲，就是利用域名服务器将域名指向特定 IP 地址，而这一指向过程需要在域名服务商添加域名解析记录来完成。

以 Godaddy 为例，步骤如下：

- 在[域名管理器](https://dcc.godaddy.com/manage/?ci=)页面，点击域名设置项进入 **DNS 管理** 页面

  ![](./img/domain_4.png)

- 查看域名服务器，如需变更可进行修改
  
  ![](./img/domain_5.png)

- 添加域名解析记录

  ![](./img/domain_6.png)

  ![](./img/domain_7.png)

在云服务器( 104.207.130.118 )部署完应用，并且域名服务器解析完成后，便可以通过域名( video.snwoball.site )直接访问应用。

## 域名记录

在添加域名记录时，会遇到多种类型选择，说明如下：

- A( Address )记录：将主机名（或域名）指向一个 IPv4 地址

  主机名就是域名前缀，常见有如下三种：

  - www：解析后的域名为 www.snowball.site，一般用于网站地址。

  - @：直接解析主域名。

  - *：泛解析，指将 *.snowball.site 解析到同一 IP。

  | 类型          | 名称           |  值           |  TTL           |
  | ------------- |:-------------:| :-------------:|  :-------------:|
  | A             | www           | 144.202.103.102 | 1小时 |

  :::tip  提示
  A 记录也可以直接添加子域名至主机名来指向特定 IP 地址。
  :::

- CNAME（ Canonical Name ） 记录：将域名指向一个域名。

  | 类型          | 名称           |  值           |  TTL           |
  | ------------- |:-------------:| :-------------:|  :-------------:|
  | CNAME         | www           | doc.snowball.site | 1小时 |

  :::tip  提示
  A 记录是把域名解析至 IP 地址，而 CNAME 记录是把域名解析至另一个域名。在应对 IP 地址易变更，或域名由第三方服务商提供时，CNAME 记录可以不需变更域名与其 IP 地址映射关系，实现无缝切换。 
  :::

- MX（ Mail Exchanger ）记录：建立电子邮箱服务，将指向邮件服务器地址。

  | 类型          | 名称           |  值           |  TTL           |
  | ------------- |:-------------:| :-------------:|  :-------------:|
  | MX            | @           | mail.snowball.site（优先：10） | 1小时 |

- TXT 记录：对域名进行标识和说明，可以使用 TXT 记录，绝大多数的 TXT 记录是用来做 SPF 记录（反垃圾邮件）。

  | 类型          | 名称           |  值           |  TTL           |
  | ------------- |:-------------:| :-------------:|  :-------------:|
  | TXT           | www           | v=spf1 a mx ~all | 1小时 |

- AAAA 记录：将域名指向一个 IPv6 地址。

  | 类型          | 名称           |  值           |  TTL           |
  | ------------- |:-------------:| :-------------:|  :-------------:|
  | AAAA          | www           | ff06:0:0:0:0:0:0:c3 | 1小时 |

- CAA（ Certification Authority Authorization ）记录：

  CAA（ 证书颁发机构授权 ）用于防止域名证书劫持

  CAA记录的格式为：[flag] [tag] [value]，是由一个标志字节的[flag]和一个被称为属性的[tag]-[value]（标签-值）对组成。您可以将多个CAA字段添加到域名的DNS记录中。格式说明细节如下：

  | 字段           | 说明           | 
  | ------------- |:-------------| 
  | flag          | 0-255之间的无符号整数，用于标志认证机构。通常情况下填0，表示如果颁发证书机构无法识别本条信息，就忽略。 | 
  | tag           | 支持 issue、issuewild 和 iodef。<br>issue：CA授权单个证书颁发机构发布的任何类型域名证书。<br>issuewild：CA授权单个证书颁发机构发布主机名的通配符证书。<br>iodef：CA可以将违规的颁发记录URL发送给某个电子邮箱。      |  
  | value         | CA的域名或用于违规通知的电子邮箱。      |  

  添加记录示例如下：

  | 类型          | 名称           |  值           |  TTL           |
  | ------------- |:-------------:| :-------------:|  :-------------:|
  | CAA           | @             | symantec.com 0 issue | 1小时 |
  | CAA           | @             | mailto:admin@snowballer0705@gmail.com 0 iodef| 1小时 |

- SOA( Start of Authority )记录：用于在众多 NS 记录中标志主服务器。

  | 类型          | 名称           |  值           |  TTL           |
  | ------------- |:-------------:| :-------------:|  :-------------:|
  | SOA           | @             | 主要域名服务器：ns51.domaincontrol.com.| 1小时 |

- NS( Name Server )记录：域名解析服务器记录。

  | 类型          | 名称           |  值           |  TTL           |
  | ------------- |:-------------:| :-------------:|  :-------------:|
  | NS            | @             | ns51.domaincontrol.com | 1小时 |
  | NS            | @             | ns52.domaincontrol.com | 1小时 |

- SRV( Service Record )记录：用于指定服务器提供服务的位置（如主机名和端口）数据的记录。

  SRV 记录的格式为：
  - 服务：服务的符号名称。
  - 协议：服务的传输协议，通常为TCP或UDP。
  - 名称：此记录生效的所在域名，以半角逗号结尾。
  - 主机：提供服务的规范主机名。
  - 优先级：目标主机的优先级，值越小越优先。
  - 权重：相同优先度记录的相对权重，值越大越优先。
  - 端口：服务所在的TCP或UDP端口。
  - TTL：标准DNS存活时间值。

  添加记录示例如下：
  | 类型          | 名称           |  值           |  TTL           |
  | ------------- |:-------------:| :-------------:|  :-------------:|
  | SRV           | _sip._tcp.snowball.site	 | 10 20 8080 doc.snowball.site | 1小时 |

- 显性 URL：一个地址重定向（ 301重定向 ）至另一个地址，需添加显性 URL 记录。

- 隐性 URL：一个地址临时跳转（ 302跳转 ）至另一个地址，需添加隐性 URL 记录。

除各域名记录以外，还有一个需要注意的配置项：TTL（ Time To Live，即生存时间 ）。

TTL 表示域名解析记录在 DNS 服务器中的缓存时间，时间长度单位是秒，一般为3600秒（ 即 1 小时 ）。时间设置越长，域名解析速度越快，同时相应的变换域名记录时，响应速度就会越慢。

## 解析流程

以 doc.snowball.site 为例，DNS 解析流程图如下：

![](./img/domain_flow.svg)

详细步骤如下：

1. 在浏览器中访问域名时，浏览器会先查询浏览器缓存中是否存在该域名的解析 IP 地址，若存在则返回对应 IP 地址

2. 当浏览器中无该域名的 IP 地址缓存时，会向本地 DNS 服务器（ Local DNS，可简称 LDNS ）发起域名解析请求，LDNS检查本地 DNS 缓存中若存在对应 IP 地址，则返回对应 IP 地址

3. 当 LDNS 中不存在对应 IP 地址缓存时，则向根 DNS 服务器发起域名查询请求

4. 根 DNS 服务器告知 LDNS 该域名已授权给 site 区管理，并返回 site 顶级域名服务器 IP 地址。同时将 site DNS服务器及其 IP 地址加入到 LDNS 缓存中，当缓存未过期时，LDNS 可以不通过根 DNS 服务器，直接请求 site 顶级域名服务器 IP 地址

5. LDNS 向 site 顶级域名服务器发起域名查询请求

6. site 顶级域名服务器告知 LDNS 该域名已授权给 snowball.site 区管理，并返回 snowball.site 二级域名服务器 IP 地址。同时将 snowball.site DNS服务器及其 IP 地址加入到 LDNS 缓存中，当缓存未过期时，LDNS 可以不通过 site 顶级域名服务器，直接请求 snowball.site 服务器 IP 地址

7. LDNS 向 snowball.site 二级域名服务器发起域名查询请求

8. snowball.site 二级域名服务器告知 LDNS 该域名 IP 地址，同时将该域名 IP 地址加入到 LDNS 缓存中，当缓存未过期时，LDNS 可以不通过权威 DNS 服务器，直接请求该域名 IP 地址

9. 浏览器缓存该域名解析后的 IP 地址，若再次请求，则无需请求 LDNS，直接返回对应 IP 地址

## 安全扩展

早期互联网环境良好，DNS 采用 UDP 协议，并没有考虑太多安全问题。正因它使用 UDP 明文通信，DNS 服务器无法验证来源，在现今互联网环境下存在DNS 欺骗、DNS Cache 污染、DNS 放大攻击等一系列问题。

为了解决安全问题，DNSSec（ Domain Name System Security Extensions，即 DNS 安全扩展 ）应运而生，使用密码学方法，实现了资源记录的签名和验证，保证了数据通信的安全性。

## 参考链接

- [顶级域名 一级域名 二级域名 三级域名什么区别?](https://www.zhihu.com/question/29998374)

- [阿里云 - 使用CAA记录防止域名证书劫持](https://help.aliyun.com/document_detail/65537.html)

- [维基百科 - SRV记录](https://zh.wikipedia.org/wiki/SRV%E8%AE%B0%E5%BD%95)

- [腾讯云 - MX记录](https://cloud.tencent.com/document/product/302/12648)

- [域名背后那些事](https://leancloudblog.com/domain-name-story-confirm/)

- [DNS入门：域名解析流程详解](https://zhuanlan.zhihu.com/p/38499577)
 