const mongoose  = require("mongoose");
const config    = require("../config/config");
const Bar      = require("../models/bar");

mongoose.connect(config.db);

//Delete all the restaurants in the database
Bar.collection.drop();

const bars = [{
  name: "Phibbers",
  image: "http://hollowaylife.net/wp-content/uploads/2014/02/img_7808-e1394817243571.jpg",
  url: "https://www.12barclub.com/",
  description: "The 12 Bar Club regrets to inform everyone that as of Tuesday 2nd February the club has been compelled to cease trading on Holloway Road.",
  lat: 51.550768,
  lng: -0.108581
}, {
  name: "Shawsbooksellers",
  image: "http://www.shawsbooksellers.co.uk/~/media/A8EB079B18CB4A56BF54CEFBE9E638A8.jpg?as=0&h=595&w=892",
  url: "http://www.shawsbooksellers.co.uk/",
  description: "Our Chefs know you can only make great food with the best ingredients. So they demand that seasonal, local produce is delivered fresh every day. That’s our Chef’s commitment to your food and one of the reasons they put their signature on every menu",
  lat: 51.512654,
  lng: -0.101296,
}];

bars.forEach((bar) => {
  Bar.create(bar, (err, bar) => {
    if (err) return console.log(err);
    return console.log(`${bar.name} was created`);
  });
});
