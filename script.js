
/*224dda2ca82558ef0e550aa711aae69c

var Request = new XMLHttpRequest();

Request.open('GET', 'http://private-anon-83640780d-themoviedb.apiary-mock.com/3/discover/movie', false);

Request.setRequestHeader('Accept', 'application/json');

Request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log('Status:', this.status);
    console.log('Status:', this.statusText);
    console.log('Headers:', this.getAllResponseHeaders());
    console.log('Body:', this.responseText);
  }
};

Request.send();
*/
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
      	 for(var i = 0; i < length; i++)
      	 {
      	 	console.log(json.results[i]);
      	 	jQuery("#results").append("<tr><td>" + json.results[i].original_title + "</td></tr>")
      	 }
	    },
	    error: function(e) {
	       console.log(e.message);
	    }
    
});

}

jQuery('input').on('change', function($) {
    var url = 'https://api.themoviedb.org/3/search/movie?api_key=224dda2ca82558ef0e550aa711aae69c&query=' + this.value + '&page=1';
    jQuery.ajax({
       type: 'GET',
        url: url,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
        length = json.results.length;
      	 
      	 	getSimilar(json.results[0].id);
      	 
	    },
	    error: function(e) {
	       console.log(e.message);
	    }
    });
});

