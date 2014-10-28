//Script to get movies similar to current
function getSimilar(id){
	   
    var url = 'https://api.themoviedb.org/3/movie/' + id +'/similar?api_key=224dda2ca82558ef0e550aa711aae69c';
    jQuery.ajax({
       type: 'GET',
        url: url,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
        
        length = json.results.length;
        if(length > 15){
          length = 15;
        }
      	 for(var i = 0; i < length; i++)
      	 {
      	 	jQuery("#results").append("<tr><td>" + json.results[i].original_title + "</td><td>"+ json.results[i].vote_average + "</td></tr>")
      	 }
         jQuery("#results").show();
         jQuery(".response").slideDown("2000");
	    },
	    error: function(e) {
	       console.log(e.message);
	    }
});

}

//Adding Autocomplete to search block

jQuery( "input" ).autocomplete({
      appendTo: '#autocomplete-options',
      delay: 500,
      source: function( request, response ) {
       
        jQuery.ajax({
            dataType: "jsonp",
            async: false,
            contentType: "application/json",
            type : 'GET',
            url: 'https://api.themoviedb.org/3/search/movie?api_key=224dda2ca82558ef0e550aa711aae69c&search_type=ngram&query=' + request.term,
            success: function(data) {
                var title;
                var movielist = [];    
                
                  for(var mov=0; mov < data.results.length && mov < 10; mov++){                  
                    title = data.results[mov].original_title + '(' +data.results[mov].release_date +')';
                    movieid = data.results[mov].id;
                    movielist[mov] = {'label': title , 'value': movieid};
                  }

                response(movielist);
          },
          error: function(data) {
              jQuery('input').removeClass('ui-autocomplete-loading');  
          }
        });
      },
      minLength: 3,
      open: function() {
          jQuery('ul.ui-autocomplete').addClass('opened');
          
      },
      close: function() {
          jQuery('ul.ui-autocomplete').removeClass('opened');
         
      },
      change: function(event,ui) {
          event.preventDefault();
          jQuery('ul.ui-autocomplete').addClass('opened');
      },
      focus:function(event,ui) {
          jQuery('ul.ui-autocomplete').addClass('opened');
          
      },
      select: function( event, ui ) {
          event.preventDefault();
          foundmovie(ui.item.value);
      }
});//End Autocomplete Code


function clear_page(){
    jQuery('#current').empty();
    jQuery("#results").empty();
    jQuery("#results").slideUp();
    jQuery('#current').slideUp();
}

/*----------------------------------
    Current Movie information query.
-----------------------------------*/
function foundmovie(movieid){
    var url = 'https://api.themoviedb.org/3/movie/' + movieid + '?api_key=224dda2ca82558ef0e550aa711aae69c';
    jQuery.ajax({
       type: 'GET',
        url: url,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            jQuery("#current").empty();
            jQuery("#current").addClass('active');     
            jQuery("#current").css('background-image',"url(http://image.tmdb.org/t/p/w500/" + json.backdrop_path +")");
            jQuery("#current").append("<img src='http://image.tmdb.org/t/p/w500" + json.poster_path + "' width:=200px' height='280px' />");
          	jQuery("#current").append("<p>Current Match: " + json.original_title  + "</p>");
            jQuery("#current").append("<p>Released: " + json.release_date +"</p>");
            jQuery("#current").append("<p>Rating: " + json.vote_average + "</p>");
            jQuery('#current').slideDown("2000", function(){
                getSimilar(json.id);
            });
            
           // jQuery("#current").effect( "slide", {direction:"up", easing: "easeOutCubic", duration:2000}, function() {
           //   
            //});
      	
      	
	    },
	    error: function(e) {
	       console.log(e.message);
	    }
    });
}

/*----------------------------------
    Load in background images
-----------------------------------*/

function latestmovie(){
    var url = 'https://api.themoviedb.org/3/movie/popular?api_key=224dda2ca82558ef0e550aa711aae69c';
    jQuery.ajax({
       type: 'GET',
        url: url,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            var resultscount = 10;
            
            for(var i = 0; i < resultscount; i++){
              jQuery(".top-imagewall").append("<img id='back-img-up" + i + "' src='http://image.tmdb.org/t/p/w500" + json.results[i].poster_path + "' width='10%' height='280px'  onload='jQuery(this).animate({opacity: 1,}, 5000);'/>");
            }   
      },
      error: function(e) {
         console.log(e.message);
      }
    });
    //Load in bottom row
    url = 'https://api.themoviedb.org/3/movie/popular?api_key=224dda2ca82558ef0e550aa711aae69c&page=2';
    jQuery.ajax({
       type: 'GET',
        url: url,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            var resultscount = 10;
            
            for(var i = 0; i < resultscount; i++){
              jQuery(".bottom-imagewall").append("<img id='back-img-down" + i + "' src='http://image.tmdb.org/t/p/w500" + json.results[i].poster_path + "' width='10%' height='280px' onload='jQuery(this).animate({opacity: 1,}, 5000);'/>");
             
            }   
      },
      error: function(e) {
         console.log(e.message);
      }
    });
}
function animateload(i){
    jQuery('#back-img-'+i).animate({
    opacity: 1,
    }, 2000, function() {
    // Animation complete.
    });
}
jQuery(document).ready(function() {
  latestmovie();
});
    
