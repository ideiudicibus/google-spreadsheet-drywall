'use strict';

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.set('X-Auth-Required', 'true');
  req.session.returnUrl = req.originalUrl;
  res.redirect('/login/');
}

function ensureAdmin(req, res, next) {

  if (req.user.canPlayRoleOf('admin')) {
    
    return next();
  }
  
  res.redirect('/');


}

function ensureAccount(req, res, next) {
  if (req.user.canPlayRoleOf('account')) {
    if (req.app.get('require-account-verification')) {
      if (req.user.roles.account.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
        return res.redirect('/account/verification/');
      }
    }
    return next();
  }
  res.redirect('/');
}

exports = module.exports = function(app, passport) {
  //front end
  app.get('/', require('./views/login/index').init);
  app.get('/about/', require('./views/about/index').init);
  app.get('/contact/', require('./views/contact/index').init);
  app.post('/contact/', require('./views/contact/index').sendMessage);

  //sign up
  app.get('/signup/', require('./views/signup/index').init);
  app.post('/signup/', require('./views/signup/index').signup);

  //social sign up
  app.post('/signup/social/', require('./views/signup/index').signupSocial);
  app.get('/signup/twitter/', passport.authenticate('twitter', { callbackURL: '/signup/twitter/callback/' }));
  app.get('/signup/twitter/callback/', require('./views/signup/index').signupTwitter);
  app.get('/signup/github/', passport.authenticate('github', { callbackURL: '/signup/github/callback/', scope: ['user:email'] }));
  app.get('/signup/github/callback/', require('./views/signup/index').signupGitHub);
  app.get('/signup/facebook/', passport.authenticate('facebook', { callbackURL: '/signup/facebook/callback/', scope: ['email'] }));
  app.get('/signup/facebook/callback/', require('./views/signup/index').signupFacebook);
  app.get('/signup/google/', passport.authenticate('google', { callbackURL: '/signup/google/callback/', scope: ['profile email'] }));
  app.get('/signup/google/callback/', require('./views/signup/index').signupGoogle);

  //login/out
  app.get('/login/', require('./views/login/index').init);
  app.post('/login/', require('./views/login/index').login);
  app.get('/login/forgot/', require('./views/login/forgot/index').init);
  app.post('/login/forgot/', require('./views/login/forgot/index').send);
  app.get('/login/reset/', require('./views/login/reset/index').init);
  app.get('/login/reset/:email/:token/', require('./views/login/reset/index').init);
  app.put('/login/reset/:email/:token/', require('./views/login/reset/index').set);
  app.get('/logout/', require('./views/logout/index').init);

  //social login
  app.get('/login/twitter/', passport.authenticate('twitter', { callbackURL: '/login/twitter/callback/' }));
  app.get('/login/twitter/callback/', require('./views/login/index').loginTwitter);
  app.get('/login/github/', passport.authenticate('github', { callbackURL: '/login/github/callback/' }));
  app.get('/login/github/callback/', require('./views/login/index').loginGitHub);
  app.get('/login/facebook/', passport.authenticate('facebook', { callbackURL: '/login/facebook/callback/' }));
  app.get('/login/facebook/callback/', require('./views/login/index').loginFacebook);
  app.get('/login/google/', passport.authenticate('google', { callbackURL: '/login/google/callback/', scope: ['profile email'] }));
  app.get('/login/google/callback/', require('./views/login/index').loginGoogle);

  //admin
  app.all('/admin*', ensureAuthenticated);
  app.all('/admin*', ensureAdmin);
  app.get('/admin/', require('./views/admin/index').init);

  //admin > users
  app.get('/admin/users/', require('./views/admin/users/index').find);
  app.post('/admin/users/', require('./views/admin/users/index').create);
  app.get('/admin/users/:id/', require('./views/admin/users/index').read);
  app.put('/admin/users/:id/', require('./views/admin/users/index').update);
  app.put('/admin/users/:id/password/', require('./views/admin/users/index').password);
  app.put('/admin/users/:id/role-admin/', require('./views/admin/users/index').linkAdmin);
  app.delete('/admin/users/:id/role-admin/', require('./views/admin/users/index').unlinkAdmin);
  app.put('/admin/users/:id/role-account/', require('./views/admin/users/index').linkAccount);
  app.delete('/admin/users/:id/role-account/', require('./views/admin/users/index').unlinkAccount);
  app.delete('/admin/users/:id/', require('./views/admin/users/index').delete);

  //admin > administrators
  app.get('/admin/administrators/', require('./views/admin/administrators/index').find);
  app.post('/admin/administrators/', require('./views/admin/administrators/index').create);
  app.get('/admin/administrators/:id/', require('./views/admin/administrators/index').read);
  app.put('/admin/administrators/:id/', require('./views/admin/administrators/index').update);
  app.put('/admin/administrators/:id/permissions/', require('./views/admin/administrators/index').permissions);
  app.put('/admin/administrators/:id/groups/', require('./views/admin/administrators/index').groups);
  app.put('/admin/administrators/:id/user/', require('./views/admin/administrators/index').linkUser);
  app.delete('/admin/administrators/:id/user/', require('./views/admin/administrators/index').unlinkUser);
  app.delete('/admin/administrators/:id/', require('./views/admin/administrators/index').delete);

  //admin > admin groups
  app.get('/admin/admin-groups/', require('./views/admin/admin-groups/index').find);
  app.post('/admin/admin-groups/', require('./views/admin/admin-groups/index').create);
  app.get('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').read);
  app.put('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').update);
  app.put('/admin/admin-groups/:id/permissions/', require('./views/admin/admin-groups/index').permissions);
  app.delete('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').delete);

  //admin > accounts
  app.get('/admin/accounts/', require('./views/admin/accounts/index').find);
  app.post('/admin/accounts/', require('./views/admin/accounts/index').create);
  app.get('/admin/accounts/:id/', require('./views/admin/accounts/index').read);
  app.put('/admin/accounts/:id/', require('./views/admin/accounts/index').update);
  app.put('/admin/accounts/:id/user/', require('./views/admin/accounts/index').linkUser);
  app.delete('/admin/accounts/:id/user/', require('./views/admin/accounts/index').unlinkUser);
  app.post('/admin/accounts/:id/notes/', require('./views/admin/accounts/index').newNote);
  app.post('/admin/accounts/:id/status/', require('./views/admin/accounts/index').newStatus);
  app.delete('/admin/accounts/:id/', require('./views/admin/accounts/index').delete);

  //admin > statuses
  app.get('/admin/statuses/', require('./views/admin/statuses/index').find);
  app.post('/admin/statuses/', require('./views/admin/statuses/index').create);
  app.get('/admin/statuses/:id/', require('./views/admin/statuses/index').read);
  app.put('/admin/statuses/:id/', require('./views/admin/statuses/index').update);
  app.delete('/admin/statuses/:id/', require('./views/admin/statuses/index').delete);

  //admin > categories
  app.get('/admin/categories/', require('./views/admin/categories/index').find);
  app.post('/admin/categories/', require('./views/admin/categories/index').create);
  app.get('/admin/categories/:id/', require('./views/admin/categories/index').read);
  app.put('/admin/categories/:id/', require('./views/admin/categories/index').update);
  app.delete('/admin/categories/:id/', require('./views/admin/categories/index').delete);

  //admin > search
  app.get('/admin/search/', require('./views/admin/search/index').find);

  //account
  app.all('/account*', ensureAuthenticated);
  app.all('/account*', ensureAccount);
  app.get('/account/', require('./views/account/index').init);

  //account > verification
  app.get('/account/verification/', require('./views/account/verification/index').init);
  app.post('/account/verification/', require('./views/account/verification/index').resendVerification);
  app.get('/account/verification/:token/', require('./views/account/verification/index').verify);

  //account > settings
  app.get('/account/settings/', require('./views/account/settings/index').init);
  app.put('/account/settings/', require('./views/account/settings/index').update);
  app.put('/account/settings/identity/', require('./views/account/settings/index').identity);
  app.put('/account/settings/password/', require('./views/account/settings/index').password);

  //account > settings > social
  app.get('/account/settings/twitter/', passport.authenticate('twitter', { callbackURL: '/account/settings/twitter/callback/' }));
  app.get('/account/settings/twitter/callback/', require('./views/account/settings/index').connectTwitter);
  app.get('/account/settings/twitter/disconnect/', require('./views/account/settings/index').disconnectTwitter);
  app.get('/account/settings/github/', passport.authenticate('github', { callbackURL: '/account/settings/github/callback/' }));
  app.get('/account/settings/github/callback/', require('./views/account/settings/index').connectGitHub);
  app.get('/account/settings/github/disconnect/', require('./views/account/settings/index').disconnectGitHub);
  app.get('/account/settings/facebook/', passport.authenticate('facebook', { callbackURL: '/account/settings/facebook/callback/' }));
  app.get('/account/settings/facebook/callback/', require('./views/account/settings/index').connectFacebook);
  app.get('/account/settings/facebook/disconnect/', require('./views/account/settings/index').disconnectFacebook);
  app.get('/account/settings/google/', passport.authenticate('google', { callbackURL: '/account/settings/google/callback/', scope: ['profile email'] }));
  app.get('/account/settings/google/callback/', require('./views/account/settings/index').connectGoogle);
  app.get('/account/settings/google/disconnect/', require('./views/account/settings/index').disconnectGoogle);


  app.all('/crud/*',ensureAdmin);
    //crud > params
  app.get('/crud/params/', require('./views/crud/params/index').find);
  app.post('/crud/params/', require('./views/crud/params/index').create);
  app.get('/crud/params/:id/', require('./views/crud/params/index').read);
  app.put('/crud/params/:id/', require('./views/crud/params/index').update);
  app.delete('/crud/params/:id/', require('./views/crud/params/index').delete);

  //crud > spreadsheets
  app.get('/crud/spreadsheets/', require('./views/crud/spreadsheets/index').find);
  app.post('/crud/spreadsheets/', require('./views/crud/spreadsheets/index').create);
  app.get('/crud/spreadsheets/:id/', require('./views/crud/spreadsheets/index').read);
  app.put('/crud/spreadsheets/:id/', require('./views/crud/spreadsheets/index').update);
  app.delete('/crud/spreadsheets/:id/', require('./views/crud/spreadsheets/index').delete);

  //crud > sheets
  app.get('/crud/sheets/', require('./views/crud/sheets/index').find);
  app.post('/crud/sheets/', require('./views/crud/sheets/index').create);
  app.get('/crud/sheets/:id/', require('./views/crud/sheets/index').read);
  app.put('/crud/sheets/:id/', require('./views/crud/sheets/index').update);
  app.delete('/crud/sheets/:id/', require('./views/crud/sheets/index').delete);

   //show > sheets
  app.all('/spreadsheets*',ensureAuthenticated);
  app.get('/spreadsheets/',require('./views/spreadsheets/index').init);
  app.get('/spreadsheets',require('./views/spreadsheets/index').init);
  app.get('/spreadsheets/:id/',require('./views/spreadsheets/index').readPopulateActiveSheet);
  app.post('/spreadsheets/:id/:sheetId/params',require('./views/spreadsheets/index').updateParams);
  app.post('/spreadsheets/:id/s/simulation',require('./views/spreadsheets/index').saveSimulationOnDb);
  app.post('/spreadsheets/:id/g/simulations',require('./views/spreadsheets/index').getSimulations);
  app.post('/spreadsheets/:id/l/simulation/:simulationId',require('./views/spreadsheets/index').getSimulation);

  app.post('/spreadsheets/activesheet/g/:sheetId',require('./views/spreadsheets/index').getActiveSheet);
  app.post('/spreadsheets/activesheet/:sheetId',require('./views/spreadsheets/index').setActiveSheet);
  app.post('/spreadsheets/activesheet/r/:sheetId',require('./views/spreadsheets/index').resetActiveSheet);

  app.get('/spreadsheets/:id/printable',require('./views/spreadsheets/index').getPrintablePage);

   //show > sheets
  app.all('/spreadsheets_v2*',ensureAuthenticated);
  app.get('/spreadsheets_v2/',require('./views/spreadsheets_v2/index').init);
  app.get('/spreadsheets_v2',require('./views/spreadsheets_v2/index').init);
  app.get('/spreadsheets_v2/:id/init/',require('./views/spreadsheets_v2/index').readPopulateInitActiveSheet);
  app.get('/spreadsheets_v2/:id/',require('./views/spreadsheets_v2/index').readPopulateActiveSheet);
  app.post('/spreadsheets_v2/:id/:sheetId/params',require('./views/spreadsheets_v2/index').updateParams);
  app.post('/spreadsheets_v2/:id/s/simulation',require('./views/spreadsheets_v2/index').saveSimulationOnDb);
  app.post('/spreadsheets_v2/:id/g/simulations',require('./views/spreadsheets_v2/index').getSimulations);
  app.post('/spreadsheets_v2/:id/l/simulation/:simulationId',require('./views/spreadsheets_v2/index').getSimulation);

  app.post('/spreadsheets_v2/activesheet/g/:sheetId',require('./views/spreadsheets_v2/index').getActiveSheet);
  app.post('/spreadsheets_v2/activesheet/:sheetId',require('./views/spreadsheets_v2/index').setActiveSheet);
  app.post('/spreadsheets_v2/activesheet/r/:sheetId',require('./views/spreadsheets_v2/index').resetActiveSheet);
  app.post('/spreadsheets_v2/:id/:sheetId/reset',require('./views/spreadsheets_v2/index').resetSpreadsheet);
  app.get('/spreadsheets_v2/:id/printable',require('./views/spreadsheets_v2/index').getPrintablePage);
  app.get('/spreadsheets_v2/:id/init/printable',require('./views/spreadsheets_v2/index').getPrintablePage);


  
//route not found
  app.all('*', require('./views/http/index').http404);
};
