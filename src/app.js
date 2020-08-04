const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const port = 3001
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use((res, req, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8')
    next()
})

const mysql = require('mysql')
const con = mysql.createConnection({
    host: 'localhost',
    user: 'ns_user',
    password: 'sM5T$e7D4',
    database: 'todolist'
})

// ヘルスチェック
app.get('/', (req, res) => res.send('Hello World!'))

// 一覧取得
app.get('/api/task', (req, res) => { 
    const sql = 'SELECT * FROM task ORDER BY orderno'

    con.query(sql, function (err, result, fields) {  
        if (err) throw err
        console.log(result)

        res.send(result)
    })
})

// 追加
app.post('/api/task', (req, res) => {
    const sql = 'INSERT INTO task SET ?'

    con.query(sql, req.body, (err, result, fields) => {
        if (err) throw err
        console.log(result)

        res.send()
    })
})

// 並び替え
app.post('/api/task/sort', (req, res) => {
    
    const sortArr = req.body.param.map((task) => {
        return {
            id: task.id,
            params: {
                orderno: task.orderno
            }
        }
    })

    for (const sortDict of sortArr) {
        const sql = `UPDATE task SET ? WHERE id = ${sortDict.id}`
        con.query(sql, sortDict.params, (err, result, fields) => {
            if (err) throw err
            console.log(result)
        })
    }
    res.send()
})

// 更新
app.put('/api/task/:id', (req, res) => {
    const sql = `UPDATE task SET ? WHERE id = ${req.params.id}` 
    con.query(sql, req.body, (err, result, fields) => {
        if (err) throw err
        console.log(result)

        res.send()
    })
})

// 削除
app.delete('/api/task/:id', (req, res) => {
    const sql_delete = `DELETE FROM task WHERE id = ${req.params.id}`

    con.query(sql_delete, (err, result, fields) => {
        if (err) throw err
        
        const sql_list = 'SELECT * FROM task ORDER BY orderno'
        con.query(sql_list, function (err, result, fields) {
            if (err) throw err
    
            const sortArr = result.map((task, index) => {
                return {
                    id: task.id,
                    params: {
                        orderno: index + 1
                    }
                }
            })
            
            // 並び替え
            for (const sortDict of sortArr) {
                console.log('dict')
                console.log(sortDict)
                const sql = `UPDATE task SET ? WHERE id = ${sortDict.id}`
                con.query(sql, sortDict.params, (err, result, fields) => {
                    if (err) throw err
                    console.log(result)
                })
            }
        })
    })
    
    res.send()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))