var Browser = require('zombie');
var assert = require('assert');

Browser.localhost('localhost', 3000);

var browser = Browser.create();

browser.visit('/login', function(err){
  browser
    .fill('email', 'admin@admin.com')
    .fill('password', 'incorrect')
    .pressButton('Login', function(err){
      console.log('Succes Test: ', browser.document.location.pathname);
    });
});
