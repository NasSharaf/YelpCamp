var express         = require("express");
var router          = express.Router();
var Campground      = require("../models/campground");
var middleware      = require("../middleware")

//==============================================================================
// routes
//==============================================================================

//INDEX - show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE - make a new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        name: name, 
        image: image, 
        price: price,
        description: desc,
        author: author
    }
    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            req.flash("success", "Successfully created a new campground!");
            res.redirect("/");
        }
    })
    //.push()
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW page
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            //console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    //find the correct campground to edit
    Campground.findById(req.params.id, function(err, foundCampground){
        //pass that campground into the edit form
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            //redirect somewhere (show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
           req.flash("error", "Something went wrong");
           res.redirect("/campgrounds");
       }else{
           req.flash("success", "Successfully deleted campground");
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;