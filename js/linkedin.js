$(document).ready(function() {
    // The following function binds all buttons to log in the user to the system through LinkedIn.
    $(".linkedin_login").live('click', function(e)
    {
        e.preventDefault();
        redirect_url = encodeURIComponent("/users/sign_in_with_linkedin");
        url = "/users/initiate_linkedin_connection?redirect_url=" + redirect_url;
        callback = function()
        {
            window.location.reload(true);
        }
        //Note, this link expects a callback function to be callable from the parent window.
        window.open(url,'LinkedInAuthentication', 'width=800,height=450,modal=yes,alwaysRaised=yes');
    });    
});

