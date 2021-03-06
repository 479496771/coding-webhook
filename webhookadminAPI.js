const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser'); //能接收post数据
const crypto = require('crypto');
const server = express();
const exec = require('child_process').execSync;


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

const myAdminApi = () =>{
    exec('git pull', {'cwd': '/var/www/myadminAPI'},
        (error, stdout, stderr) => {
            console.log('stdout========================\n' + stdout + '====================================');
            console.log('stderr========================\n' + stderr + '====================================');
            if (error !== null) {
                console.log('pull失败！')
            } else {
                console.log('pull成功！')
            }
            console.log(error,'pull成功')
        });
    exec('npm install',{'cwd':'/var/www/myadminAPI'},
        (error,stdout,stdin) =>{
            if (error !== null){
                console.log('失败')
            }else{
                console.log('install')
            }
            console.log(error,'install成功')
        })
    console.log('myadmin后台更新完成')
}


//服务器的webhook配置
server.post('/webhookadminAPI', (req, res) => {
    console.log('接口调用成功')
    if(myAdminApi(req,'webhookadminAPI')){
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Thanks Coding <3');
        hooksPull()
    }else {
        res.status('400').json({ state: 'error' });
    }

});

server.listen(6667);

