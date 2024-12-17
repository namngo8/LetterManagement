const mongoose = require("mongoose");

let gridFSBucket;

async function connectDb() {
    try {
        const connection = await mongoose.connect("mongodb://127.0.0.1:27017/LetterManagement");
        console.log("connect db success");

    } catch (error) {
        console.log("failed", error);
    }
}

module.exports = { connectDb };