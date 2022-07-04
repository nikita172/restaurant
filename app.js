const express = require("express")
const mysql = require("mysql")
const cors = require("./cors")
const md5 = require('md5')

const connection = mysql.createPool({
    host: 'localhost',
    user: 'rnpiydyj_rest_user',
    password: 'blahblah123',
    database: 'rnpiydyj_rest_db'
})

const server = express()

server.use(cors)
server.use(express.json())
server.use(express.urlencoded())
server.post("/auth/login", function (req, res) {
    const { email, password } = req.body
    connection.query("SELECT * FROM user WHERE email = ?", [email], (err, rows) => {
        if (rows.length === 0) {
            res.json({
                status: false,
                message: "Email not registered!"
            })
            return;
        }

        const [row] = rows;

        if (row.password !== md5(password)) {
            res.json({
                status: false,
                message: "Incorrect Password!"
            })
            return;
        }
        res.json({
            status: true,
            message: "Login Success",
            user: {

                name: row.name,
                id: row.id,
                email: row.email
            }
        })
    })
})


server.post("/auth/register", function (req, res) {
    const { email, password, c_password, name } = req.body
    connection.query("SELECT * FROM user WHERE email = ?", [email], (err, rows) => {
        console.log(err)
        if (rows.length > 0) {
            res.json({
                status: false,
                message: "Email already registered!"
            })
            return;
        }
        if (password !== c_password) {
            res.json({
                status: false,
                message: "Passwords do not match!"
            })
            return;
        }
        connection.query(
            "INSERT INTO user (name, email, password) VALUES(?, ?, ?)",
            [name, email, md5(password)],
            (err, result) => {
                if (err) {
                    res.json({
                        status: false,
                        message: "Unable to register!"
                    })
                    return;
                }
                res.json({
                    status: true,
                    message: "Successfully registered",
                    user: {
                        id: result.insertId,
                        name: name,
                        email: email,
                    }
                })
            })
    })
})

server.get('/food-items', (req, res) => {
    connection.query("SELECT * FROM fooditems ", (err, result) => {
        console.log(err, result)
        res.json({
            status: 1,
            message: "",
            items: result
        })
    })
})
server.get('/getordered-items', (req, res) => {
  
    
    connection.query("SELECT * FROM orderdetails", (err, result) => {
        console.log(err)
        res.json({
            status: 1,
            message: "",
            items: result
        })
    })
})
server.post('/ordereditems', (req, res) => {
    const { loginId, name, mobile, pincode, state, address, location, items,payment } = req.body
    console.log(items)
    connection.query("INSERT INTO orderdetails (loginid,name, mobile, pincode,state,address,city,itemsordered,total) VALUES(?,?, ?, ?,?, ?, ?,?,?) ", [loginId, name, mobile, pincode, state, address, location, JSON.stringify(items),payment], (err, result) => {
     
        if (err) {
            console.log(err)
            res.json({
                status: 0,
                message: "Oops! Something went wrong"
            })
        } else {
            res.json({
                status: 1,
                message: "Order Placed",

            })
        }
    })
})
server.delete('/delete-ordereditems',(req,res)=>{
    const {userid} = req.body
    console.log(userid)
    
    connection.query("DELETE FROM orderdetails WHERE id = ?",userid,(err,result)=>{
        if(err){           
            res.json({
                status:0,
                message:"Oops! something went wrong"
            })
        }else{
            res.json({
                status:1,
                message:"Items deleted successfully"
            })
        }
    })
})
server.listen(8080, () => {
    console.log("App is listening to port 8080!")
})