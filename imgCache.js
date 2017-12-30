var http = require('https');
var fs = require('fs');
var request = require('request');

var URL = 'https://api.monappy.jp/v1/picture_places';
var offset = 0;

var dir = "picplayweb/public/images/cache/";
var f;
fs.readdir(dir, function(err, files) {
  f=files;
  getData();
});
function getData(){
  request.get({
    uri: URL,
    headers: {'Content-type': 'application/json'},
    qs: {
      max:'1',
      offset:offset
    },
    json: true
    }, function(err, req, data){
      nowData = data.data;
      var name = nowData[0].image_url.match(".+/(.+?)([\?#;].*)?$")[1];
      if(!f.indexOf(name)){
        console.log(nowData[0]);
        var outFile = fs.createWriteStream(dir+name);
        var req = http.get(nowData[0].image_url, function (res) {
        res.pipe(outFile);
          res.on('end', function () {
            offset = offset+1;
            getData();
          });
        });
      }
  });
}
