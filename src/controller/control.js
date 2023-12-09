exports.login = (req,res)=>{
    console.log(1)
    res.render('login')
}

exports.chat = (req,res)=>{

    const {number} = require('../index') 
    const {user_name} = req.body
    res.render('chat',{user_name,number})

}
