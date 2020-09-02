const os = require('os');

const networkInterfaces = os.networkInterfaces();

for (let devName in networkInterfaces) {
    let iface = networkInterfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
      console.log(alias.address);
    }
  }

