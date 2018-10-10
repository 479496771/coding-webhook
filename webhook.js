const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser'); //能接收post数据
const crypto = require('crypto');
const server = express();


server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.text({ type: '*/*' }));
server.use(multer());

const verifyWebhook = (req,hook) => {
    if (!req.headers['user-agent'].includes('Coding.net Hook')) {
        return false;
    }
    const theirSignature = req.headers['x-coding-signature'];
    console.log(theirSignature,'头部签名');
    const payload =req.body;
    let secret = hook;
    console.log(secret,'环境变量')
    const ourSignature = `sha1=${crypto.createHmac('sha1', secret).update(payload).digest('hex')}`;
    console.log(ourSignature,'自己组合的签名')
    return crypto.timingSafeEqual(Buffer.from(theirSignature), Buffer.from(ourSignature));
};

const hooksPull = () =>{
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
}

const myAdminPull = () =>{
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
            console.log(error,'pull成功')
        });
    exec('npm install',{'cwd':'/var/www/myadmin'},
        (error,stdout,stdin) =>{
            if (error !== null){
                console.log('失败')
            }else{
                console.log('install')
            }
            console.log(error,'install成功')
        })
    exec('npm run build',{'cwd':'/var/www/myadmin'},
        (error,stdout,stdin) =>{
        console.log(error,'构建成功')
            if (error !== null){
                console.log('失败')
            }else{
                console.log('构建成功')
            }
        })
}


//服务器的webhook配置
const exec = require('child_process').execSync;
server.post('/webhook', (req, res) => {
    if(verifyWebhook(req,'myadmin')){
        myAdminPull()
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Thanks Coding <3');
    }else if(verifyWebhook(req,'webserver')){
        hooksPull()
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Thanks Coding <3');
    }

});

server.listen(6666);

