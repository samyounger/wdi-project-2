# wdi-project-2
====

##BarPleeze: A GoogleMaps website integrating another data API - Twitter

### Assignment
**Description:** Design a website which uses google maps to display location and information using a secondary data source. The site should provide authentication for users.

### Chosen topic
**Descrition:** A program which pulls in the GoogleMaps API. The user can search by location for places of interest and by topic e.g. restaurant etc. Once the target destination has been chosen, recent commentary is listed relating to the location, and events happening nearby for additional entertainment.

The map is restricted to London only.

---

### User experience
1. The homepage is blank with a title & description
2. The user registers with:
	* Username
	* Email address
	* Password
	* Password confirmation
3. The user logs in using username & password
	* This opens the map and full functionality
4. User enters destination in box 1
5. User enters type of destination from a fixed list:
	* Restaurant
	* Pub
	* Cafe
6. The website returns 5x recommendations. Listed is:
	* place name
	* place characteristics; pub, restaurant, library
	* photo of the place
	* link to the place website
	* description of the place
	* a link to facebook/twitter feed?
7. User selects one of the 5 recommendations
8. The website returns on the map directions to the destination. The user can select transport by:
	* Car
	* Bicycle
	* Public transport
9. The website returns all recent tweets related to the place name
10. The map highlights trending events closest to the destination (optional time depending)


**Additional points:** the site should be mobile responsive, with a fast reload. Probably best to use bootstrap for quick mobile responsive design, and limited use of images.

---

### Application Programming Interfaces to use:

1. **Google maps:** [Link] (https://developers.google.com/maps/documentation/javascript/)
	* Geolocation: [Link] ()
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

###Colour Theme

The website should have a light theme so it can be viewed during the daytime on mobile devices.

Given the use of twitter, a blend of twitter blue, google multi-colours.

Colour Palette:

![Colour Palette](images/color-palette.png "Image of the color palette")

Fonts: font-family: 'Cormorant Infant', serif;
![Font Sample](images/font-sample.png "Font example")

```
<link href="https://fonts.googleapis.com/css?family=Cormorant+Infant:500,500i,700" rel="stylesheet">
```

---

###Thinking through the problem

**Authentication:**

- The page is produced on one html page. All new pages are rendered through JavaScript
- A profile needs to be created for the user
- The user has the ability to 'favourite' a restaurant, which saves to their array

**The Map**

- Search bar with google places, to search for just Bars
	* Google places needs to reverse geocode the location by name
- The search needs to return only 5x recommendations, no more
- All 5 should be listed with a description, and a marker on the map
	* is it possible to give a specialised icon to each of the 5?
- The map should be able to locate where you are, and give a tfl transport recommendation to get there. Too difficult? Maybe just walk
- The map should provide a description of the bar and a photo

**Twitter**

- The name of the bar is placed into the API search by keyword, and all the latest tweets appear (from last 7 days I believe)

**Favourites**

- The user has the ability to favourite a bar. This saves all the details to their profile for later reference