// Keyword Level Demographics Code
// written by Michael King
// with contributions from Joshua Giardino
// based on code by Mat Clayton
// and including code found on StackOverflow
//
//
// More info on the keyword-level demographics 
// project at http://www.ipullrank.com/blog/keyword-level-demographics



// This function collects and stores the Search Referrer
// This function requires the sessvars library by Thomas Frank
// http://www.thomasfrank.se/sessionvars.html

function searchRef()
{
   if (typeof sessvars.ref == 'undefined') 
   {
	// grab document referrer
	var url = String(document.referrer);
	
	// confirm they came from search or at least the big 3
	if ((url.indexOf ("google.com") !=-1) || (url.indexOf ("yahoo.com")  !=-1) || (url.indexOf("bing.com") !=-1))
	{
 	    var urlVars = {};
	    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) 	        
		{      
			urlVars[key] = value;

		});
		// Update Google & Bing use q=, Yahoo uses p=
		if ((url.indexOf ("google.com") !=-1) || (url.indexOf("bing.com") !=-1))
		{
			urlVars["q"] = urlVars["q"].replace(/%20/g," ");

			sessvars.ref = urlVars["q"].replace(/\+/g, " ");
		}
		elseif (url.indexOf ("yahoo.com"))
		{
			urlVars["p"] = urlVars["p"].replace(/%20/g," ");

			sessvars.ref = urlVars["p"].replace(/\+/g, " ");
		}

	}
	else
	{
	   sessvars.ref = "not search";
	}

	return sessvars.ref;
    }

    else{
    	return sessvars.ref;
    }
}

// Function for grabbing Facebook Data
function getFBDemos()
{

	var userData = new Array();
	FB.api('/me', function(res) 
	{
		if(res) 
		{
			window.console.log(res);
			if (typeof res.birthday != 'undefined')
			{
				userData[0] = res.birthday;
			} else {
				userData[0] = 'undefined';	
			}
			if (typeof res.location != 'undefined')
			{
				userData[1] = res.location.name;
			} else {
				userData[1] = 'undefined';	
			}
			if (typeof res.gender != 'undefined')
			{
				userData[2] = res.gender;
			} else {
				userData[2] = 'undefined';	
			}
			if (typeof res.id != 'undefined')
			{
				userData[3] = res.id;
			} else {
				userData[3] = 'undefined';	
			}
			// NOW do pushDemos stuff, inline instead of as a return
			pushDemos(ref, userData[0], userData[1], userData[2], userData[3]);
			// this is happening before the API Call is finished for some reason
			return userData;
		} else {
			window.console.log("error with fb.api /me");
			return userData;
		}
	});

}

// the function that makes it all work
// Requires Oauth 2.0 to be turned off
// based on Mat Clayton's code from
// Social Design presentation
function kwdemos()
{
	FB.getLoginStatus (function (res)
	{
		window.console.log(res);
		if(res.status === 'connected')
		{
			window.console.log("user connected");
			getFBDemos();
			window.console.log("returned demographics: ");
		} else if (res.status === 'notConnected')
		{
			window.console.log("user logged in");
		
		} else if(res.status === 'unknown') 
		{
			window.console.log("No Facebook Session detected");
		}
	});
}


// Function to Make Sure FB.init is done
// found at http://stackoverflow.com/questions/3548493/how-to-detect-when-facebooks-fb-init-is-complete
function fbEnsureInit(callback) {
	if(!window.fbApiInitialized) {
		window.console.log("timeout set: " + callback);
		setTimeout(function() {fbEnsureInit(callback);}, 50);
	} else {
		if(callback) {
			window.console.log("callback executed");
			callback();
		}
	}
}