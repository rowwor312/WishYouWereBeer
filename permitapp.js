// Adding click event listen listener to all buttons
$("button").on("click", function() {
  // Grabbing and storing the data-location property value from the button
  var mapLocation = $(this).attr("data-location");
 
var queryURL = "https://data.nashville.gov/resource/3wb6-xy3j.json?$where=within_circle(mapped_location," + mapLocation + ")&permit_subtype=ONSALES";

// var queryURL = "https://data.nashville.gov/resource/3wb6-xy3j.json?$where=within_circle(mapped_location, 36.174465,-86.767960, 1000)&permit_subtype=ONSALES";



   // Perfoming an AJAX GET request to queryURL
   $.ajax({
   url: queryURL,
     method: "GET"
   })

  // After the data from the AJAX request comes back
      .then(function(response) {
       console.log(queryURL);

       console.log(response);
      
      // Storing the data from the AJAX request in the results variable
      
      
      // Looping through each result item
       for (var i = 0; i < response.length; i++) {
          
        // Creating and storing a div tag
        var nameDiv = $("<div>");

//         // Creating a paragraph tag with the result item's business name
        var businessName = $("<p>").text("Business Name: " + response[i].business_name); 
        var humanAddress = $("<p>").text(response[i].mapped_location.human_address);
        var plat = $("<p>").text("Latitude: " + response[i].mapped_location.latitude); 
        var plong = $("<p>").text("Longitude: " + response[i].mapped_location.longitude);
       
        
         console.log(response[i]);
                 

        // Appending the paragraph and image tag to the nameDiv
        nameDiv.append(businessName);
        nameDiv.append(humanAddress);
        nameDiv.append(plat);
        nameDiv.append(plong);
          
          // nameDiv.append(pAddress);

        // Prependng the nameDiv to the HTML page in the "#names-appear-here" div
        // $("#names-appear-here").append(nameDiv);
        $("#table-data").append(nameDiv)       
        
        
       }                
       
        
    });
      
    
  });
   
         
 

    // document.write(html);
