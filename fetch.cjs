const https = require('https');
https.get('https://html-classic.itch.zone/html/1326450/index.html?v=1574335883', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data));
});
