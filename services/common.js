const passport = require("passport")
// exports.isAuth = (req, res, next)=> {
//   if (req.user) {
//     // done();
//     next();
//   } else {
//     res.send(401);
//   }
// }
exports.isAuth = (req, res, next)=> {
return passport.authenticate("jwt")
}
exports.sanitizeUser =(user)=>{
    return {id:user.id, role:user.role}
}
