//Dependencies
var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    seedDB              = require("./seeds")

//Routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")

//connect mongoose
mongoose.connect(process.env.DATABASEURL);
//connect to mongoLab
//mongoose.connect("mongodb+srv://NasSharaf:nsrsharaf7@cluster0-ubrdq.mongodb.net/test?retryWrites=true");

//Connects to ejs
app.set("view engine", "ejs");
//includes bodyparser
app.use(bodyParser.urlencoded({extended: true}));
//connect css
app.use(express.static(__dirname + "/public"));
//use method override for edit/update routes
app.use(methodOverride("_method"));
//connect to flash
app.use(flash());
//auto-populate website with values
// seedDB();

//PASSPORT Configuration
app.use(require("express-session")({
    secret: "I love Moomoo even though he doesn't love me",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//function to add user on navbar/header.js once logged in
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//use the routes for campgrounds, comments, and authentication/index
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);

//Check to see if server is up
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!!!");
});