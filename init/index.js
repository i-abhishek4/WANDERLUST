const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/models/listing.js");

main().then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WANDERLUST")
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"6762d03d7c77fe81fde79065"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();