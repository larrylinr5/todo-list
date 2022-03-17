//#region Kata 步驟註解
// 1. npm init
// 2. http 套件實體化
// 3. npm install uuid --save
// 4. uuid 套件實體化
// 5. 建立 todoList 存放代辦事項資料
// 6. req.method 有 GET、POST、PATCH、DELETE、OPTIONS、Default (預設404)
// 7. 第 6 點透過 switch case 製作
// 8. 撰寫 Lib.js 回傳成功事件 && 回傳失敗事件
// 9. 將第 6 點逐一完成
//#endregion Kata 步驟註解


/** http套件實體化 */
const http = require('http')
const lib = require('./lib');
/** uuid套件實體化 */
const { v4: uuid4 } = require('uuid')
/** todoList node.js 存放變數 */
const todoList = []

const requestListener = (req, res) => {
  /** 協助組合操作者傳來的 body */
  let body = ''

  // 註冊 監聽 req 傳來的片段 data 然後組合
  req.on('data', chunk => {
    body += chunk
  })

  //#region 當路徑不是 '/todos' 或 /todos/{{id}} 時 顯示404訊息
  if (!(['/todos'].includes(req.url) || req.url.startsWith('/todos/')) || ['/todos/'].includes(req.url)) {
    // 預設 404 
    res.writeHead(404, lib.headers);
    res.write(JSON.stringify({
      status: 'false',
      message: '無此網站路由',
    }));
    res.end();
  }
  //#endregion

  //#region 透過 switch case 製作req.method
  switch (req.method) {
    // GET 取得
    case 'GET':
      if (req.url === '/todos') lib.sucessHandle(res, todoList)
      break;
    // POST 新增
    case 'POST':
      if (req.url === '/todos') {
        // 組合完成 (註冊)
        req.on('end', () => {
          try {
            const title = JSON.parse(body).title
            if (title !== undefined) {
              // 組要新增的物件
              const todo = {
                title: title,
                id: uuid4()
              }
              // 將組好的物件加入陣列
              todoList.push(todo)

              lib.sucessHandle(res, todoList)
            }
            else {
              lib.errorHandle(res)
            }
          }
          catch {
            lib.errorHandle(res)
          }
        })
      }
      break;
    // PATCH 修改
    case 'PATCH':
      if (req.url.startsWith('/todos/')) {
        req.on('end', () => {
          try {
            /** 取得修改的 title */
            const title = JSON.parse(body).title
            /** 取得前端傳送的 id */
            const id = req.url.split('/').pop()
            /** 取得 id 在陣列中的 index */
            const index = todoList.findIndex(element => element.id === id)
            if (title !== undefined && index !== -1) {
              // 更新資料
              todoList[index].title = title

              lib.sucessHandle(res, todoList)
            }
            else {
              lib.errorHandle(res)
            }
          }
          catch {
            lib.errorHandle(res)
          }
        })
      }
      break;
    // DELETE 刪除全部、刪除單筆
    case 'DELETE':
      // 刪除全部
      if (req.url === '/todos') {
        // 清空todos
        todoList.length = 0

        lib.sucessHandle(res, todoList)
      }
      // 刪除單筆
      else if (req.url.startsWith('/todos/')) {
        /** 取得前端傳送的 id */
        const id = req.url.split('/').pop()
        /** 取得 id 在陣列中的 index */
        const index = todoList.findIndex(element => element.id === id)

        if (index !== -1) {
          // 刪除
          todoList.splice(index, 1)

          lib.sucessHandle(res, todoList)
        }
        else {
          lib.errorHandle(res)
        }
      }
      break;
    // OPTIONS 檢查機制
    case 'OPTIONS':
      res.writeHead(200, lib.headers);
      res.end();
      break;
    default:
  }
  //#endregion


}

const server = http.createServer(requestListener)
server.listen(process.env.PORT || 3005)