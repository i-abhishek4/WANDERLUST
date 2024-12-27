const express=require("express");
const router=express.Router();
const Listing=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/models/listing.js");
const wrapAsync=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/utils/wrapAsync.js")
const ExpressError=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/schema.js")
const {isLoggedIn}=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/middleware.js");
const {isOwner}=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/middleware.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        if(error){
            throw new ExpressError(400,error);
        }else{
            next();
        }
}

//Index route
router.get("/",async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
 });
 
 //new route
 router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user)
   
     res.render("listings/new.ejs");
 })
 
 //Show route
 router.get("/:id",wrapAsync(async (req,res)=>{
     let {id}=req.params;
     const listing=await Listing.findById(id)
     .populate({
        path:"reviews",
        populate:
        {path:"author"},})
        .populate("owner");
     if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
     }
     console.log(listing);
     res.render("listings/show.ejs",{listing});
 }))

 //create route
router.post("/",validateListing,isLoggedIn,wrapAsync(async (req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    console.log(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings")

}))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
let {id}=req.params;
const listing=await Listing.findById(id);
if(!listing){
    req.flash("error","Listing you requested does not exist");
    res.redirect("/listings");
 }
res.render("listings/edit.ejs",{listing});
}))

//update route
router.put("/:id",validateListing,isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
req.flash("success","Listing Updated");
res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
let {id}=req.params;
await Listing.findByIdAndDelete(id);
req.flash("success","Listing Deleted");
res.redirect("/listings");
}));


module.exports=router;