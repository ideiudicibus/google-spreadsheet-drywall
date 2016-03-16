
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.generate= function() {
  var passwd = '';
  var chars = 'abcdefghijklmnopqrstuvwxyz'
  var upperCase='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var numbers='0123456789';
  var specialChars='!@#$&*';
  var upperCaseS= upperCase.charAt(getRandomIntInclusive(0,upperCase.length-1)); 
  var specialCharsS = specialChars.charAt(getRandomIntInclusive(0,specialChars.length-1));
  var numbersS = numbers.charAt(getRandomIntInclusive(0,numbers.length-1));
   
  var charsS='';
  
  for (i=1;i<6;i++) {
    var c = Math.floor(getRandomIntInclusive(0,chars.length-1));
    charsS += chars.charAt(c)
  }

  return upperCaseS+specialCharsS+numbersS+charsS;

}