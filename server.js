const express = require('express');
const server = express();

 
server.all('/', (req, res) => {
  res.send(`OK`)
})
 
function keepAlive() {
  server.listen(3000, () => { console.log("Le serveur est prêt !!" + Date.now()) });
}
 
module.exports = keepAlive;