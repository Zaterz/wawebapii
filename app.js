const express = require('express')
const bodyParser = require('body-parser')
const {
        WAConnection,
        WAChatUpdate,
        MessageType,
        Presence,
        MessageOptions,
        Mimetype,
        WALocationMessage,
        WA_MESSAGE_STUB_TYPES,
        ReconnectMode,
        ProxyAgent,
        GroupSettingChange,
        waChatKey,
        mentionedJid,
        processTime,
} = require('@adiwajshing/baileys')
const fs = require('fs')
const app = express()
const conn = new WAConnection

if(fs.existsSync('./auth_info.json')){
                conn.loadAuthInfo('./auth_info.json')
        }else{
                conn.on('open', () => {
                console.log('login wa ke save.')
                const authInfo = conn.base64EncodedAuthInfo()
                fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t'))
            })
    }

      conn.connect ()

const urlEncoded = bodyParser.urlencoded({ extended : false })


app.post('/', urlEncoded, (req,res) => {
	try{
	
	function send(nomor, data){
		idno = nomor + '@s.whatsapp.net'
		return conn.sendMessage (idno, `Halo ${data.nama} Terimakasih Telah Mengisi Form!\nJawaban : ${data.jawab}`, MessageType.text)
	}
	const nama = req.body.nama.trim()
	let no = req.body.nomor.trim()
	const jawab = req.body.jawaban.trim()
	if(nama.length >= 13){
		res.header(400)
		res.send('Error')
		return
	}
	if(no.startsWith('08')){
		no = '62' + no.slice(1,no.length)
		console.log(no)
		send(no, {
			nama : nama,
			jawab : jawab
		})
		res.header(200)
		res.send('Success')
	}
	else if(no.startsWith(62)){
		send(no, {
			nama : nama,
			jawab : jawab
		})
	}else{
	res.header(400)
	res.send('Error')
}
}catch(error){
res.header(500)
res.send('Error Code : 500')
}
})

app.get('/', (req,res) => {
	res.send('api')
})

app.listen(80, () =>{
	console.log('server started')
})

