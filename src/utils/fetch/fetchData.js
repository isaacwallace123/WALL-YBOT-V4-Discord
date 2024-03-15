const axios = require('axios');

module.exports = async function(Link) {
    try {
        return await axios.get(Link).then(function(response) {
            return response.data;
        });
    } catch(error) {
        console.log(error);
    }
}