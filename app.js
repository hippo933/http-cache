const http = require('http')
const fs = require('fs')
const url = require('url')
const etag = require('etag')

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url)
    if (pathname === '/') {
      const data = fs.readFileSync('./index.html')
      res.end(data)
    } else if (pathname === '/images/01.jpeg') {
      const data = fs.readFileSync('./images/01.jpeg')

      // expires
      // res.writeHead(200, {
      //   // 2022-02-17 17:48:45
      //   Expires: new Date('2022-02-17 17:50:30').toUTCString()
      // })

      // cache-control: max-age=5
      // res.writeHead(200, {
      //   'Cache-control': 'max-age=5' // 资源在5s后过期
      // })

      // last-modified
      // 文件修改时间
      // const { mtime } = fs.statSync('./images/01.jpeg')
      // const ifModifiedSince = req.headers['if-modified-since']
      // // 如果文件修改时间等于 `if-modified-since` 时间，说明资源没有被修改过可以直接返回304状态码
      // if (ifModifiedSince === mtime.toUTCString()) {
      //   res.statusCode = 304
      //   res.end()
      //   return
      // }
      // // 文件发生了修改或者第一次请求资源
      // res.setHeader('last-modified', mtime.toUTCString())
      // res.setHeader('Cache-Control', 'no-cache')

      // 通过 etag库 生成etag字符串
      const etagContent = etag(data)
      // 上一次服务器端给到的etag字符串
      const ifNoneMatch = req.headers['if-none-match']
      // 通过对比当前文件的etag 和 客户端上一次获取到的 etag来判断文件是否被修改
      if (ifNoneMatch === etagContent) {
          res.statusCode = 304
          res.end()
          return
      }
      res.setHeader('etag', etagContent)
      res.setHeader('Cache-Control', 'no-cache')

      res.end(data)
    } else {
      res.statusCode = 404
      res.end()
    }
  })
  .listen(3000, () => {
    console.log('http://localhost:3000')
  })
