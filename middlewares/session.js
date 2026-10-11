const session = require("express-session");

function loginAgainPrevention(req,res,next){
    if(session.user){
        return res.redirect('/')
    }
    next()
}
module.exports = {
    loginAgainPrevention
}