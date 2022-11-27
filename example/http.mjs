import axios from "axios";
import * as https from 'https'
https.globalAgent.options.rejectUnauthorized = false
axios.get('https://api.github.com/orgs/zth-cli/repos').then((result) => {
  console.log(result)
}).catch((err) => {
  
});