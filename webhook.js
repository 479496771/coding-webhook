const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser'); //能接收post数据
const crypto = require('crypto');
const server = express();


server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json()); // for parsing application/json
server.use(multer());

const verifyWebhook = (req) => {
    if (!req.headers['user-agent'].includes('Coding.net Hook')) {
        return false;
    }
    // Compare their hmac signature to our hmac signature
    // (hmac = hash-based message authentication code)
    const theirSignature = req.headers['x-coding-signature'];
    console.log(theirSignature,'头部签名');
    const payload = JSON.stringify(req.body);
    // const secret = process.env.SECRET_TOKEN;
    const secret = 'myadmin node webhook.js';
    console.log(secret,'环境变量')
    const ourSignature = `sha1=${crypto.createHmac('sha1', secret).update(payload).digest('hex')}`;
    console.log(ourSignature,'自己组合的签名')
    return crypto.timingSafeEqual(Buffer.from(theirSignature), Buffer.from(ourSignature));
};

const hooksPull = () =>{
    if ('hooks' === req.headers['X-Coding-Signature']) {
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
    }
}

const myAdminPull = () =>{
    if ('myadmin' === req.headers['X-Coding-Signature']) {
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
    }
}


//服务器的webhook配置
const exec = require('child_process').execSync;
server.post('/webhook', (req, res) => {
    if(verifyWebhook(req)){


    }else {
        console.log('失败')
    }

});

server.listen(6666);

