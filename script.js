//Script to get movies similar to current
function getSimilar(id){
	   jQuery("#results").empty();
    var url = 'https://api.themoviedb.org/3/movie/' + id +'/similar?api_key=224dda2ca82558ef0e550aa711aae69c';
    jQuery.ajax({
       type: 'GET',
        url: url,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
        console.log(json.results);
        length = json.results.length;
      	 for(var i = 0; i < length; i++)
      	 {
      	 	jQuery("#results").append("<tr><td>" + json.results[i].original_title + "</td><td>"+ json.results[i].vote_average + "</td></tr>")
      	 }

	    },
	    error: function(e) {
	       console.log(e.message);
	    }
    
});

}

//Adding Autocomplete to search block

jQuery( "input" ).autocomplete({
      appendTo: '#searchbar',
      source: function( request, response ) {
       
        jQuery.ajax({
            dataType: "jsonp",
            async: false,
            contentType: "application/json",
            type : 'GET',
            url: 'https://api.themoviedb.org/3/search/movie?api_key=224dda2ca82558ef0e550aa711aae69c&search_type=ngram&query=' + request.term,
            success: function(data) {

            
                var title = [];
                
                for(var mov=0; mov < data.results.length; mov++){
                  
                  title[mov] = data.results[mov].original_title;
                 
                }
                console.log(data);
                
            
            
            response(title);
          },
          error: function(data) {
              jQuery('input').removeClass('ui-autocomplete-loading');  
          }
        });
      },
      minLength: 3,
      open: function() {

      },
      close: function() {

      },
      focus:function(event,ui) {

      },
      select: function( event, ui ) {
          foundmovie(ui.item.value);
      }
});
//End Autocomplete Code

//Current Movie information query.
function foundmovie(moviename){
    var url = 'https://api.themoviedb.org/3/search/movie?api_key=224dda2ca82558ef0e550aa711aae69c&query=' + moviename + '&page=1';
    jQuery.ajax({
       type: 'GET',
        url: url,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
        length = json.results.length;
        jQuery("#current").empty();
        console.log(json.results[0]);
        jQuery("#current").addClass('active');
        jQuery("#current").css('background-image',"url(http://image.tmdb.org/t/p/w500/" + json.results[0].backdrop_path +")");
        jQuery("#current").append("<img src='http://image.tmdb.org/t/p/w500" + json.results[0].poster_path + "' width:=200px' height='280px' />");
      	jQuery("#current").append("<p>Current Match: " + json.results[0].original_title  + "</p>");
        jQuery("#current").append("<p>Released: " + json.results[0].release_date +"</p>");
        jQuery("#current").append("<p>Rating: " + json.results[0].vote_average + "</p>");
      	getSimilar(json.results[0].id);
      	
	    },
	    error: function(e) {
	       console.log(e.message);
	    }
    });
}