  
const fetch = require("node-fetch")

class Requester {

  async request(URL) {
    let res = await fetch(URL)
    return await res.json()
  }

}
module.exports = new Requester();