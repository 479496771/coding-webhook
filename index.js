const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const exec = require('child_process').execSync;

const verifyWebhook = (req,x) => {
    if (!req.headers['user-agent'].includes('Coding.net Hook')) {
        return false;
    }
    const theirSignature = req.headers['x-coding-signature'];
    const payload = req.body;
    const secret = x;
    console.log(secret)
    const ourSignature = `sha1=${crypto.createHmac('sha1', secret).update(payload).digest('hex')}`;
    return crypto.timingSafeEqual(Buffer.from(theirSignature), Buffer.from(ourSignature));
};


const app = express();
app.use(bodyParser.text({ type: '*/*' }));

const notAuthorized = (req, res) => {
    console.log('Someone who is NOT Coding is calling, redirect them');
    res.redirect(301, '/'); // Redirect to domain root
};


const myAdminPull = (res) =>{
    exec('git pull', {'cwd': '/var/www/myadmin'},
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

    console.log('完成')
}

app.post('/webhook', (req, res) => {
    if (verifyWebhook(req,'myadmin')) {
        // Coding calling
        // myAdminPull(res);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Thanks Coding <3');
    } else {
        // Someone else calling
        notAuthorized(req, res);
    }
});

app.all('*', notAuthorized); // Only webhook requests allowed at this address

app.listen(6666);


