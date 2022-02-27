/** 表頭資訊 */
const headers = {
    // #region cors 跨網域設定
    // Headers允許的資訊 Content-Type, Authorization, Content-Length, X-Requested-With
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    // 允許跨網域使用的方法 PATCH, POST, GET, OPTIONS, DELETE
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    // #endregion
    
    // JSON格式的回傳設定
    'Content-Type': 'application/json'
}

const lib = {
    headers:headers,
    /** 錯誤控制
     * @param res requestListener的response變數
     */
    errorHandle:res=>{
        res.writeHead(400,headers);
        res.write(JSON.stringify({
            status: 'false',
            message: '欄位未填寫正確，或無此 todo id',
        }));
        res.end();
    },
    /** 成功控制
     * @param res requestListener的response變數
     * @param todoList node暫存的todoList資料
     */
    sucessHandle:(res,todoList)=>{
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            status: 'success',
            data: todoList,
        }));
        res.end();
    }
}
module.exports = lib;