const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {validateReview, isReviewAuthor} = require("../middlewares.js");
const { isLoggedIn } = require("../middlewares.js");
const reviewControler = require("../controler/review.js");

//review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  reviewControler.createReview
);

// review delete route
router.delete(
  "/:reviewId",
  isReviewAuthor,
  wrapAsync(reviewControler.deleteReview)
);

module.exports = router;
