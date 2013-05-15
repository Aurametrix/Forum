// This file contains the functinality for rendering the Invite Friend from LinkedIn and Invite Friend From Facebook dialogs.

function initialize_linkedin_friend_picker(friend_picker_title, message_dialog_title, link, default_subject, default_body)
{

               $.getJSON("/users/get_linkedin_connections",
                    function(result) {
                        $("#linkedin_tab").empty();
                        $.each(result, function(index, connection)
                        {
                          
                            var $container = $("<div>");
                            $container.attr("class", "linkedin_friend_invite_container");
                            var $invite_link = $("<div>");

                            $invite_link.attr("class", "invite_linkedin_friend"); 
                            $invite_link.click( function() {
                                $(this).toggleClass("selected");
                            })
                            $invite_link.attr("id", connection['id']);
                            var $profile_picture = $("<img>");
                            if (connection['picture'] == "")
                            {
                                $profile_picture.attr({src : "/assets/images/profile_default.png", width : "80px"});
                            }
                            else
                            {
                                $profile_picture.attr("src", connection['picture']);
                            }
                            $invite_link.append($profile_picture);

                            $invitee_name = $("<p>");
                            $invitee_name.attr("class", "invitee_name");
                            $invitee_name.text(connection['first_name'] + " " + connection['last_name']);
                            $invitee_name.appendTo($invite_link);

                            $container.append($invite_link);
                            $container.appendTo($("#linkedin_tab"));
                            $("#invite_dialog").dialog("option", "buttons", {
                                "Invite" : function() { 
                                    var selected_friends_ids = $.map($(".selected"), function(element) {
                                        return element.id;
                                    });
                                    // The following statement creates a dialog to prompt the user to enter the subject and message to send to the invitees.
                                    $("#invite_linkedin_friend_form_container").dialog({
                                        modal: true,
                                        title: message_dialog_title,
                                        buttons: {
                                            "Invite" : function() {
                                                $($("#invite_linkedin_friend_form")).validate({
                                                    debug: true,
                                                    rules: {
                                                        "subject": "required",
                                                        "body": "required"
                                                    },
                                                    submitHandler: function() {
                                                        $.post("/users/send_linkedin_message", {
                                                            "subject": $("#subject").val(),
                                                            "body": $("#body").val(),
                                                            "link": link,
                                                            "id" : selected_friends_ids
                                                        }, function(result) {
                                                           if (result['success'] == 1)
                                                           {
                                                               title="Sent Invitation";
                                                               message = "Your friend should receive the invitation shortly.";
                                                           }
                                                           else
                                                           {
                                                               title = "Error";
                                                               message = "Unable to send your invitation. Please contact your community's system administrator.";
                                                           }
                                                           $message = $("<div>");
                                                           $message.text(message);
                                                           $message.css("padding", "10px");
                                                           $("#invite_linkedin_friend_form_container").dialog("close");
                                                           $message.dialog({
                                                               modal: true,
                                                               title: title,
                                                               buttons: {
                                                                   "Close" : function() {

                                                                       $(this).dialog("close");
                                                                       
                                                                   }
                                                               }
                                                           });                                               
                                                        },"json");
                                                    }
                                                });
                                                $("#invite_linkedin_friend_form").submit();
                                            },
                                            "Cancel" : function() {
                                                $(this).dialog("close");
                                            }
                                        }
                                    });

                                },
                                "Cancel" : function() {
                                    $(this).dialog("close");
                                }
                            });
                        });
                        standardize_invitee_name_height();
                }); 

}

/**
 * Note that this functino depends on v2/sites/invite_friend.view
 * friend_picker_title: The title of the friend picker
 * message_dialog_title: The title of the message dialog
 * link: The link to invite the friend to.
*/
function initialize_friend_picker(friend_picker_title, message_dialog_title, link, default_subject, default_body)
{
   $("#facebook_tab button.facebook").unbind("click");

    // The following statement attaches an event handler to the "Invite friend from Facebook" button in the tabbed dialog."
    $("#facebook_tab button.facebook").click(function() {
        FB.ui({
            method: 'send',
            link: link
        });
    }); 


    // The statement attaches an event handler to the 'Connect with LinkedIn' button in the tabbed dialog.
    $("a.linkedin").click(function() {
        $.getJSON("/users/check_linkedin_access", function(result) {
            callback = function()
            {
                initialize_linkedin_friend_picker(friend_picker_title, message_dialog_title, link, default_subject, default_body);
            }
            if (result['is_linkedin_authenticated'] == "yes")
            {
                callback();
            }
            else
            {
                var redirect_url = encodeURIComponent("/users/merge_linkedin_account");
                $connect_with_linkedin = $("<button>");
                $connect_with_linkedin.addClass("connect_with");
                $connect_with_linkedin.addClass("connect_with_linkedin");
                
                $connect_with_linkedin.text("Connect With Linkedin");
                
                $connect_with_linkedin.click(function() {
                    window.open("/users/initiate_linkedin_connection?redirect_url=" + redirect_url,'LinkedInAuthentication', 'width=448,height=312,modal=yes,alwaysRaised=yes');
                });
                $("#linkedin_tab").empty();
                $connect_with_linkedin.appendTo($("#linkedin_tab"));
                
            }
        });
    });
    //The following statement displays the tabbed interface for choosing to invite a friend to answer a question through LinkedIn or Facebook.
    $("#invite_tabs").tabs( {}).addClass("ui-tabs-vertical ui-helper-clearfix");

    $("#tabs li").removeClass("ui-corner-top").addClass("ui-corner-left");

    //The following statement binds the button for inviting a friend to answer question to display the dialog for choosing whether to invite friends from LinkedIn or Facebook.
    $("#invite_dialog").dialog( {
        modal: true,
        width: 480,
        height: 420,
        title: friend_picker_title,
        resizable: false,
        draggable: false
    });        
    
    //The following conditional checks to see if the LinekdIn tab is already selected when the invite dialog is rendered.
    // If so, then we initialize the LinkedIn Friend picker
    if ($("#linkedin_tab_link").hasClass("ui-tabs-selected"))
    {
        $.getJSON("/users/check_linkedin_access", function(result) {
            callback = function()
            {
                initialize_linkedin_friend_picker(friend_picker_title, message_dialog_title, link, default_subject, default_body);
            }
            if (result['is_linkedin_authenticated'] == "yes")
            {
                callback();
            }
            else
            {
                var redirect_url = encodeURIComponent("/users/merge_linkedin_account");
                window.open("/users/initiate_linkedin_connection?redirect_url=" + redirect_url,'LinkedInAuthentication', 'width=448,height=312,modal=yes,alwaysRaised=yes');
            }

        });
    }
}


// The following function standardizes the LinkedIn connections' name heights in the friend picker.
function standardize_invitee_name_height() 
{
     var maxHeight = 0;
    $("p.invitee_name").each(function(index, value) {
        var name = $(this).text();

        var maxLength = 25;
        if (name.length > maxLength)
        {
            $(this).text(name.slice(0,maxLength-3) + "...");
        }
        name_height = $(this).height();
        if (name_height > maxHeight)
        {
            maxHeight = name_height;
        }
    });
    $(".invitee_name").height(maxHeight);
}
