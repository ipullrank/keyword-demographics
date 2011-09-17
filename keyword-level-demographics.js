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

function searchRef() {
	if(typeof(sessvars) != 'undefined') { // Failsafe
		if(typeof(sessvars.source) == 'undefined') { // Only set if not already defined
			// Store referrals
			var referrals = new Array();
			// NOTE! Last match wins
			referrals.push({'match': '^https?\:\/\/(www\.)?google\.[a-z\.]{2,5}\/', 'parameter': 'q', 'type': 'search'}); // Google (all)
			referrals.push({'match': '^https?\:\/\/(www\.)?bing\.com\/', 'parameter': 'q', 'type': 'search'}); // Bing (all)
			referrals.push({'match': '^https?\:\/\/([a-z]{2,4})?\.search\.yahoo\.com\/', 'parameter': 'p', 'type': 'search'}); // Bing (all)
			referrals.push({'match': '^https?\:\/\/[a-z\.\-]+\.facebook\.com\/', 'parameter': '', 'type': 'social'}); // Facebook General (not very effective, since most links are from URL shorteners)
			// Set default value
			cleanReferrer = document.referrer.replace(/(^[^\/]+\/\/)/g, '');
			if(document.referrer == '') {
				sessvars.source = {'referrer': '', 'type': 'direct', 'keyword': ''};
			} else {
				sessvars.source = {'referrer': cleanReferrer, 'type': 'referral', 'keyword': ''};
				for(i=0;i<referrals.length;i++) {
					if(RegExp(referrals[i].match).test(document.referrer)) {
						sessvars.source.type = referrals[i].type;
						sessvars.source.keyword = getURLParameter(referrals[i].parameter, document.referrer, true);
					}
				}
			}
		}
		return sessvars.source;
	} else {
		return null;
	}
}

// Helper function to get URL parameters
// Based on gup http://www.netlobo.com/url_query_string_javascript.html
function getURLParameter (name, url, decode) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	if(!url) url = window.location.href;
	var results = regex.exec(url);
	if(results == null) return "";
	else if(!decode) return results[1];
	else return results[1].replace(/(\%20|\+)/g, ' '); // Only decode whitespaces
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