var Campground      = require("../models/campground");
var Comment         = require("../models/comment");

//all middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //is the user logged in at all?
    if(req.isAuthenticated()){
         //find the correct campground to edit
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                //if not redirect
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                //does the user own the campground
                //must use id.equals() because foundCampground.author is a mongoDB object
                //meaning that req.user._id is a string but foundCampground.author is not
                //even though they both output as strings
                if(foundCampground.author.id.equals(req.user._id)){
                    //pass that campground into the edit form
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                };
            };
        });
    } else {
        //sends to previous page
        req.flash("error", "You need ot be logged in to do that");
        res.redirect("back");
    };
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is the user logged in at all?
    if(req.isAuthenticated()){
         //find the correct campground to edit
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                //if not redirect
                req.flash("error", "comment not found");
                res.redirect("back");
            } else {
                //does the user own the comment
                //must use id.equals() because foundCampground.author is a mongoDB object
                //meaning that req.user._id is a string but foundCampground.author is not
                //even though they both output as strings
                if(foundComment.author.id.equals(req.user._id)){
                    //pass that campground into the edit form
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                };
            };
        });
    } else {
        //sends to previous page
        req.flash("error", "You need ot be logged in to do that");
        res.redirect("back");
    };
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj