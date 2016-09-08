# wdi-project-2
====

## TweeThought: A google maps website integrating another data API - twitter

### Assignment
**Description:** Design a website which uses google maps to display information points using a third party API.

### Chosen topic
**Descrition:** A program which pulls in the Google Maps API, uses google places so users can search location for places of interest and by topic e.g. restaurant etc. Once the target destination has been chosen, data is pulled in from Twitter which provides recent commentary on the location, and of events happening nearby if additional entertainment is wanted.

---

### Application Programming Interfaces to use:

1. **Google maps:** [Link] (https://developers.google.com/maps/documentation/javascript/)
	* Places: [Link] (https://developers.google.com/maps/documentation/javascript/places)
	* Directions: [Link] (https://developers.google.com/maps/documentation/javascript/directions)
	* Transit layer: [Link] (https://developers.google.com/maps/documentation/javascript/trafficlayer)
3. **Twitter API:** [Link] (https://dev.twitter.com/rest/public)

	* The Search API: Tweets by place [Link] (https://dev.twitter.com/rest/public/search-by-place)
		- You can search for Tweets about places using the place operator of the Search API. 
	* Get trends/closest [Link] (https://dev.twitter.com/rest/reference/get/trends/closest)
		- Returns the locations that Twitter has trending topic information for, closest to a specified location.

4. **TFL:** If time is left, integrate the TFL library for London.
	* If google maps does not offer high quality transport information, see how easy it is to integrate TFL transport information. [Link] (https://api.tfl.gov.uk/)

---

### Further thoughts