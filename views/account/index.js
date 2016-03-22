'use strict';

exports.init = function(req, res){
  //res.render('account/index');
  console.log(res.locals.user.passwordExpires);
   if(res.locals.user.passwordExpires && res.locals.user.passwordExpires <= 0  ){
      
      return res.redirect('/account/settings/');
      
    }
    else{	
  res.redirect('/spreadsheets');
}
};
