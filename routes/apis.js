
var express = require('express');
var router = express.Router();
var createConn = require("../sources/CreateConn");
var stateCode = require("../sources/StateCode");
const md5 = require("md5-js");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

function checkUserAndPassword(req, res, next) {
    if (!req.body.name) {
        res.json({state: stateCode.NO_USER_NAME, message: "no user name"});
    }
    if (!req.body.pwd) {
        res.json({state: stateCode.NO_PASSWORD, message: "no password"});
    }
    next();
}

router.post("/register", checkUserAndPassword)
    .post("/register", function (req, res, next) {
        let conn = createConn();
        conn.connect1().then(result=> {
            return conn.query1("INSERT INTO `login` (`name`,`password`) VALUES(?,?)",
                [req.body.name, md5(req.body.pwd)]);
        }).then(result=> {
            res.json({state: stateCode.ALLOW_LOGIN_OR_REGISTER, message: "OK"});
            conn.end();
        }).catch(error=> {
            res.json({state: error.errno, message: error.code});
        })
    });
router.post("/login", checkUserAndPassword)
    .post("/login", function (req, res, next) {
        let conn = createConn();
        conn.connect1().then(result=> {
            return conn.query1("SELECT * FROM `login` WHERE `name`=?", [req.body.name]);
        }).then(function (rows) {
            if (rows.length) {
                var result = rows[0];
                if (md5(req.body.pwd) == result.password) {
                    res.json({state: stateCode.ALLOW_LOGIN_OR_REGISTER, message: "OK"});
                } else {
                    res.json({state: stateCode.PASSWORD_WRONG, message: "password wrong"});
                }
            } else {
                res.json({state: stateCode.NO_SUCH_USER, message: "no such user"});
            }
            conn.end();
        }).catch(function (error) {
            res.json({state: error.errno, message: error.code});
        })
    });

router.post("/update", function (req, res) {
    let conn = createConn();
    conn.connect1().then(result=> {
        return conn.query1("INSERT INTO `article` (`userId`,`title`,`text`,`time`) VALUES (?,?,?,?)",
            [req.body.userId, req.body.title, req.body.article,req.body.curTime])
    }).then(function (err) {
        if (!err) {
            res.json({state: stateCode.ALLOW_LOGIN_OR_REGISTER, message: "OK"});
        } else {
            console.log(err);
            res.json({state: stateCode.FAIL_TO_SAVE_USER_INFO, message: "fail to save user info"})
        }
        conn.end();
    }).catch(function (error) {
        res.json({state: error.errno, message: error.code});
    })
});

router.post("/article", function (req, res, next) {
    let conn = createConn();
    conn.connect1().then(result=>{
        return conn.query1("SELECT * FROM `article` WHERE `userId`=?", [req.body.name]);
    }).then(function (rows) {
        if (rows.length){
            res.json({state:stateCode.ALLOW_LOGIN_OR_REGISTER,message:rows})
        }else {
            res.json({state:stateCode.LENGTH_IS_ZERO,message:"length is zero"})
        }
        conn.end();
    }).catch(function (err) {
        console.log(err);
        res.json({state: error.errno, message: error.code});
    })
});
module.exports = router;
