const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middlewares.js");
const { isUser } = require("../middlewares.js");
const listingControler = require("../controler/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage: storage});


router.route("/")
.get(wrapAsync(listingControler.index))
.post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingControler.createListing));

// new listing creating route
router.get("/new", isLoggedIn, listingControler.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingControler.showListing))
.patch(isUser,isLoggedIn, upload.single("listing[image]"), listingControler.updateListing)
.delete(isUser, isLoggedIn, listingControler.destroyListing);


// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingControler.editListing)
);

// category router
router.get("/category/:category", wrapAsync(async(req,res) => {
  let {category} = req.params;
  const allListings = await Listing.find({category: category});
  res.render("listings/index.ejs", {allListings});
}));



module.exports = router;
