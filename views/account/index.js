'use strict';

exports.init = function(req, res){
  //res.render('account/index');
   if(res.locals.user.passwordExpires <= 0  ){
      
      return res.redirect('/account/settings/');
      
    }
    else{	
  res.redirect('/spreadsheets');
}
};
