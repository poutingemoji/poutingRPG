  
const fetch = require("node-fetch")

const Requester =  {

  async request(URL) {
    let res = await fetch(URL)
    return await res.json()
  }

}
module.exports = Requester