if(process.env.NODE_ENV === "production"){
    module.exports = require('./firebasekey_prod');
}else{
    module.exports = require('./firebasekey_dev');
}
