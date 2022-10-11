const User = require("../models/user.model");
module.exports = function (permittedRoles) {
  return function async (req, res, next) {
    const user = req.user;
   
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let isAllowed = false;
   
    User.find({ email:user}).then((userData)=>{
     // console.log(userData[0].roles,permittedRoles)
       userData[0].roles.map((role) => {

        //  if(permittedRoles.length==2){

        //  }
        if (permittedRoles[1]==role || permittedRoles[0]==role) {
          isAllowed = true;
        }
      })
    
    }).then(()=>{
      // console.log(isAllowed)
      if (isAllowed==true) {
        // console.log('hii')
        return next();
        }else{
        return res.status(403).json({ message: "You are not allowed to access this" });
      }
    }).catch((err)=>{
      return res.status(403).json(err)
 });

    // if (!isAllowed) {
    //   return res.status(403).json({ message: "You are not allowed to access this" });
    // }else{
    //   return next();
    // }
  };
};
