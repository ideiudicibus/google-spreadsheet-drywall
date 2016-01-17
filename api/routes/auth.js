var jwt = require('jwt-simple');

var auth = {

  login: function(req, res) {

    var username = req.body.username || '';
    var password = req.body.password || '';

   

    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to your DB and check if the credentials are valid
    var validationResult = auth.validate(username, password,req,res);
   
  },

  validate: function(username, password,req,res) {
    var conditions = { isActive: 'yes' };

    if (username.indexOf('@') === -1) {
        conditions.username = username;
      }
      else {
        conditions.email = username;
      }

          req.app.db.models.User.findOne(conditions, function(err, user) {
        if (err) {

          res.status(401);
      res.json({
        "status": 401,
        "message": JSON.stringify(err)
      });
      return;
          
        }

        if (!user) {
         

          res.status(401);
      res.json({
        "status": 401,
        "message": "Unknown user"
      });
      return;
        }

        req.app.db.models.User.validatePassword(password, user.password, function(err, isValid) {
          if (err) {
            res.status(401);
      res.json({
        "status": 401,
        "message": JSON.stringify(err)
      });
      return;
          }

      if (!isValid) {
            //return done(null, false, { message: 'Invalid password' });
            res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid password"
      });
      return;
          }

          res.json(genToken(user));
          return;
        });
      });

    
  },

  validateUser: function(username,req,callback) {
    // spoofing the DB response for simplicity
     console.log(JSON.stringify(username));

     var conditions = { isActive: 'yes' };
     if (username.indexOf('@') === -1) {
        conditions.username = username;
      }
      else {
        conditions.email = username;
      }
     req.app.db.models.User.findOne(conditions, function(err, user) {

      callback(user,err);

     })
  
  }


}

// private method
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
