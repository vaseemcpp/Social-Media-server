const mongoose = require('mongoose');

module.exports = async() => {
const mongoUri = 'mongodb+srv://vaseemDADA:vaseemDADA@jhatuuuu.qegsfs1.mongodb.net/lwdaaaa'

try {
const connect = await mongoose.connect(mongoUri, {
useUnifiedTopology:true,
useNewUrlParser:true,
});

console.log(`Mongo connected:${connect.connection.host}`);
} catch (error) {
    console.log(error);
    process.exit(1);
}
    
}