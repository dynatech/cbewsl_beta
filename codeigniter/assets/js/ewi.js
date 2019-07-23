
//Not Jquery !!! just a helper function to return an object
// function $(i_obj) {
//     return document.getElementById(i_obj);
// }

window.fbAsyncInit = function () {
    FB.init({
        appId: '1991811884256968', // App ID : Insert the APP ID of the APP you created here
        status: true,
    });
}


function fbLogin() {
    FB.login(function (response) {
        if (response.status == "connected") {
            //User has logged in, hide the login button and show the launch button

            $("btnlogin").className = "Hide";
            $("btnlauncher").className = "Show";

        } else {
            // user has not yet logged in, hide launcher button and display login button

            $("btnlogin").className = "Show";
            $("btnlauncher").className = "Hide";
        }
    });
}

//Function displays the Feed Dialog
function LaunchFeedDialog() {

    //Create an object with the below properties.
    //There are a lot more parameters than what I have written below. Will explain each one of them in coming posts.
    var obj = {
        method: 'feed',
        link: 'http://cbewsl.com/',
        name: 'A Title for Feed Dialog',
        caption: 'SAMPLE',
        description: 'A description for the URL which is to be displayed',
        message: 'ALert!'
    };

    //Calling the Facebook API : Important
    FB.ui(obj, callback);
}

function callback(response) {
    //Do anything you want here :)
    //document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
    //alert(response['post_id']); Some diagnostics lol :)
}

// Load the SDK Asynchronously. This is a very important part. It loads the Facebook javascript SDK automatically.
(function (d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));
