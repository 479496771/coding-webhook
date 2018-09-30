const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser'); //能接收post数据
const server = express();


server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json()); // for parsing application/json
server.use(multer());

//服务器的webhook配置
const exec = require('child_process').execSync;
server.post('/webhook', (req, res) => {
    console.log(req.body,'//////////////////////////////////////////')
    console.log(req.body['token'],1)
    console.log(req.headers['x-coding-event'],2)
    if ('hooks' === req.body['token']) {
        console.log(3)
        exec('git pull', {'cwd': '/var/www/webserver'},
            (error, stdout, stderr) => {
                console.log('stdout========================\n' + stdout + '====================================');
                console.log('stderr========================\n' + stderr + '====================================');
                if (error !== null) {
                    res.send('<pre>fail!!!\n' + stdout + error + '</pre>');
                } else {
                    res.send('<pre>done!!!\n' + stdout + '</pre>');
                    console.log('push成功！')
                }
            });
        exec('npm install',{'cwd':'/var/www/webserver'},
            (error,stdout,stdin) =>{
                if (error !== null){
                    console.log('失败')
                }else{
                    console.log('构建成功')
                }
            })
        exec('npm run build',{'cwd':'/var/www/webserver'},
            (error,stdout,stdin) =>{
                if (error !== null){
                    console.log('失败')
                }else{
                    console.log('构建成功')
                }
            })
    } else if ('myadmin' === req.body['token']) {
        console.log(4)
        exec('git pull', {'cwd': '/var/www/myadmin'},
            (error, stdout, stderr) => {
                console.log('stdout========================\n' + stdout + '====================================');
                console.log('stderr========================\n' + stderr + '====================================');
                if (error !== null) {
                    res.send('<pre>fail!!!\n' + stdout + error + '</pre>');
                } else {
                    res.send('<pre>done!!!\n' + stdout + '</pre>');
                    console.log('push成功！')
                }
            });
        exec('npm install',{'cwd':'/var/www/myadmin'},
            (error,stdout,stdin) =>{
                if (error !== null){
                    console.log('失败')
                }else{
                    console.log('构建成功')
                }
            })
        exec('npm run build',{'cwd':'/var/www/myadmin'},
            (error,stdout,stdin) =>{
                if (error !== null){
                    console.log('失败')
                }else{
                    console.log('构建成功')
                }
            })
    } else {
        console.log(' failed token ===================================');
        res.send('<pre>token不正确?</pre>');
    }
});

server.listen(6666);

