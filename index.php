<?php  

	/*-------------------------------------------
	Request Popular movies list, we are specifically wanting the poster addresses
	Returns PHP Object
	--------------------------------------------*/

	if(function_exists("curl_init")) {
		$req = curl_init();
		curl_setopt($req, CURLOPT_URL, "https://api.themoviedb.org/3/movie/popular?api_key=224dda2ca82558ef0e550aa711aae69c");
		curl_setopt($req, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Accept: application/json'));
	    curl_setopt($req, CURLOPT_HTTPGET, true);
	    curl_setopt($req, CURLOPT_SSL_VERIFYPEER, false);
	    curl_setopt($req, CURLOPT_SSL_VERIFYHOST, false);
	    curl_setopt($req, CURLOPT_RETURNTRANSFER, true);
		$res = curl_exec($req);
		curl_close($req);
		$json = json_decode($res);
	}
	
	/*-------------------------------------------
	Store Local Copies if they are not already present on the server
	Note: First load with no images will take a long time to load, once they are on the server it will never redownload unless they are deleted.
	--------------------------------------------*/
	$backgroundimages = [];
	foreach ($json->results as $image) {
		
		if(file_exists ('images'. $image->poster_path)){
			
			$backgroundimages[] .=  $image->poster_path;
		}
		
		else{
			//Request Image
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, "http://image.tmdb.org/t/p/w500" . $image->poster_path);
			curl_setopt($ch, CURLOPT_BINARYTRANSFER,1);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_HEADER, 0);
			$newimage = curl_exec($ch);
			curl_close($ch);
			//Write to drive
			$fp = fopen('images'. $image->poster_path, 'w+');
			fwrite($fp, $newimage);
			
			fclose($fp);
			
		}
		
	}

	/*
	*	Next step is to optimise the images on the server and server smaller images on the site.
	*/
?>


<!DOCTYPE html>
<html>
	<head>
	<link rel="stylesheet" type="text/css" href="style.css"></style>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
	<title>What to watch</title>
	</head>
	<body>
		<div class="top-imagewall">
		<!--Capture the first 10 images for the bottom row-->
		<?php for($i = 0 ; $i <10; $i++){
			echo "<img id='back-img-up" . $i . "' src='images". $backgroundimages[$i] . "' width='10%' height='280px' />";
		} ?>		
		</div>

		<div class="container">

			<div id="searchbar">
			<input  type="text" class="form-control" placeholder="Search...">
			</div>
			<!--While typing this area will be popilated with possible movies-->
			<div id="autocomplete-options"></div>
			<!--Currently selected movie that is being displayed-->
			<div id="current"></div>
			<div type="text" class="response">
				<table id="results" class="table results table-striped table-hover"><th>Similar Movies</th></table>
			</div>
		</div>

		<div class="bottom-imagewall">
			<!--Capture the final 10 images for the bottom row-->
			<?php for($i = 10 ; $i <20; $i++){
				echo "<img id='back-img-down" . $i . "' src='images". $backgroundimages[$i] . "' width='10%' height='280px' />";
			} ?>		
		</div>
	</body>
	
	<footer>
		<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
		<script src="//code.jquery.com/ui/1.11.1/jquery-ui.js"></script>
		<script src="script.js"></script>
	</footer>
</html>