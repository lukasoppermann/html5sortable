const fs = require('fs')
const http = require('http')
const server = http.createServer(function (req, res) {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'})

    fs.readFile('./test/umd/es6.html', function (err = null, data) {
      res.end(data)
    })
  }
  if (req.url === '/_test/html.sortable.es.js') {
    res.writeHead(200, {'Content-Type': 'application/javascript'})

    fs.readFile('./_test/html.sortable.es.js', function (err = null, data) {
      res.end(data)
    })
  }
})
server.listen(9999)
console.log(`ES6 Module test on: http://localhost:9999/`)
