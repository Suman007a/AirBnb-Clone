const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_AECESS_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("err", "Listing does not exits");
      return res.redirect("/listings");
    }
    
    res.render("listings/show.ejs", { listing });
  };

  module.exports.createListing =  async(req, res, next) => {
    let {location, country} = req.body;
    let resCode = await geocodingClient.forwardGeocode({
      query: `${location}, ${country}`,
      limit: 1,
    })
      .send();
    
    const url = req.file.path;
    let fileName = req.file.filename;
    const newLis = await new Listing(req.body);
    newLis.image = {url, fileName};
    newLis.owner = req.user._id;
    newLis.geometry = resCode.body.features[0].geometry;
    await newLis.save();
    req.flash("success", "New listing successfully created!");
    res.redirect("/listings");
  };

  module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("err", "Listing does not exits");
      res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage.replace("/upload", "/upload/h_250,w_200");
    res.render("listings/edit.ejs", { listing,originalImage });
  };

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let updatedLis = req.body;
    let listing = await Listing.findByIdAndUpdate(id, updatedLis);

    if(typeof req.file !== "undefined") {
    const url = req.body.path;
    let fileName = req.file.filename;
    listing.image = {url, fileName};
    await listing.save();
    }
    req.flash("update", "Listings updated successfully");
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("delete", "Listing deleted successfully");
    res.redirect("/listings");
  };