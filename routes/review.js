const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/models/listing.js");
const wrapAsync=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/utils/wrapAsync.js")
const ExpressError=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/schema.js")
const Review=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/models/review.js")
const {isReviewAuthor,isLoggedIn}=require("/Users/abhishekalli/Documents/AC/MAJORPROJECT/middleware.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
        if(error){
            throw new ExpressError(400,error);
        }else{
            next();
        }
}

//reviews post route
router.post("/",isLoggedIn,validateReview,wrapAsync( async(req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Posted");
    res.redirect(`/listings/${listing._id}`);
}));

//review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}))

module.exports=router;