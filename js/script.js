//Retrieves a GET parameter from the URL
//Stolen from http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
function getParameterByName(name) {

    var match = RegExp('[?&]' + name + '=([^&]*)')
                    .exec(window.location.search);

    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


$(document).ready(function() {

    // more topics hover
    $('#view_more_topics').mouseenter(function(){
            $(this).find('.tooltip_topics').show();
    }).mouseleave(function(){
            $(this).find('.tooltip_topics').hide();
    });

    // top search bar
    $('#search input[name=q]').focus(function() {
            $('#search .search_label').addClass('focus');
    }).blur(function(){
            if($(this).val() == '')
                    $('#search .search_label').removeClass('focus').show();
    }).bind('blur, keypress, keyup',function() {
            if($(this).val() != '')
                    $('#search .search_label').hide();
            else
                    $('#search .search_label').show();
    });
	
	// input overlay labels
	$('.row_overlay_label input, .row_overlay_label textarea').focus(function() {
		$(this).parent().find('.overlay_label').addClass('focus');
	}).blur(function(){
		if($(this).val() == '')
			$(this).parent().find('.overlay_label').removeClass('focus').show();
	}).bind('blur, keypress, keyup',function() {
		if($(this).val() != '')
			$(this).parent().find('.overlay_label').hide();
		else
			$(this).parent().find('.overlay_label').removeClass('focus').show();
	});
	
        
        
        
	$('.toggle_login_signup').click(function(e) {
		e.preventDefault();
		clear_form_errors($(this).closest('form'));
		
		if($(this).hasClass('for_login_panel')) {
			$('.login_panel form').hide();
			
			if($(this).hasClass('for_forgot_password'))
				$('.login_panel form.forgot_password_form').show();
			else if($(this).hasClass('for_login'))
				$('.login_panel form.login_form').show();
			else if($(this).hasClass('for_signup'))
				$('.login_panel form.signup_form').show();
		} else if($(this).hasClass('for_login_inline')) {
			$('.inline_auth form').toggle();
		}
	});
	
	// toggle editor
	$('.toggle_editor a').click(function(e) {
		e.preventDefault();
		
		if($(this).text() == 'Use standard editor')
		{
			$(this).text('Use markdown editor');
			$(this).closest('form').find('input[name=editor_type]').val('standard');
		}
		else
		{
			$(this).text('Use standard editor');
			$(this).closest('form').find('input[name=editor_type]').val('markdown');
		}
		
		$(this).closest('.row').find('.spngEditor').toggle();
	});
	
	// facebook button
	
	$('button.facebook').live('click', function(e)
	{
		var btn_obj = $(this);
		
	    FB.login(function(response)
	    {
	    	if (response.authResponse)
	    	{	    		
	    	    if(btn_obj.hasClass('connect_account') == true)
	    	        connect_facebook();
	    	    else if(btn_obj.hasClass('upload_from') == true)
	    	        picture_facebook();
	    	    else
	    	        auth_facebook(btn_obj);	    	    	
	    	} 
	    	else
	    	{
	    	  FB.api({method: 'Auth.revokeAuthorization'}, function(response) {});
	    	}
	    },{scope:'publish_stream,email,offline_access'});
	});
	
	// twitter button
	$('button.twitter').live('click', function(e)
	{
		e.preventDefault();
  		var btn_obj = $(this);
		var reload = '0';
  		
  		if(btn_obj.hasClass('inline_auth') == false)
  			reload = '1';
  		
  		if(btn_obj.hasClass('connect_account') == true)
			var w = window.open('/users/connect/twitter', 'TwitterAuthentication', 'width=800,height=450,modal=yes,alwaysRaised=yes');
		else
			var w = window.open('/login/twitter?reload=' + reload, 'TwitterAuthentication', 'width=800,height=450,modal=yes,alwaysRaised=yes');
			
		var watchClose = setInterval(function()
		{
		    try
		    {
		        if (w.closed)
		            clearTimeout(watchClose);
		    } 
		    catch (e) {}
		}, 200);
	});
	

	
	// wysiwyg editor
	$('textarea.spngmceEditor').tinymce({
	    theme : "advanced"
	});
	
	
	// toggle tabs in profile
	$('.edit_profile_tabs a').click(function(e) {
		e.preventDefault();
		var form_name = $(this).prop('name');
		toggle_tabs($(this).parent(), $(this).parent().parent());
		$('.user_edit_panel form').toggle();
	});
	
	// thanks
	$('.thank a').click(function(e) {
		e.preventDefault();
		var obj = $(this);
		
		$.getJSON(obj.prop('href'), function(data) {		
		    if(data.status == 'success')
		    	process_thank(obj);
		});
	});
	
	// reports
	$('.report a').click(function(e) {
		e.preventDefault();
		var obj = $(this);
		
		$.getJSON(obj.prop('href'), function(data) {		
		    if(data.status == 'success')
		    	process_report(obj);
		});
	});
	
	// comments
	$('a.show_comments').click(function(e) {
		e.preventDefault();
		var obj_class = $(this).prop('name');
		$('.' + obj_class).toggle();
	});
	
	$('a.delete_comment').click(function(e) {
		e.preventDefault();
		var obj = $(this);
		
		$.getJSON(obj.prop('href'), function(data) {
			if(data.status == 'success')
				obj.closest('.comment').fadeOut();
		});
	});
	
	// answer question link
	$('.question .actions .answer a').click(function(e) {
		e.preventDefault();
		$('html,body').animate({scrollTop: $('.post_answer').offset().top});
	});
	
	// follows
	$('.follow a').click(function(e) {
		e.preventDefault();
		var obj = $(this);
		$.getJSON(obj.prop('href'), function(data) {
			if(data.status == 'success') {
				process_follow(obj);
			}
		});
	});
	
	// votes
	$('.vote a').click(function(e) {
		e.preventDefault();
		var obj = $(this);
		$.getJSON(obj.prop('href'), function(data) {
			if(data.status == 'success')
				process_vote(obj, data);
		});
		
	});
	
	// more button
	$('button.more').click(function(e) {
		e.preventDefault();
		var btn_obj = $(this),
			view_more_of = $(this).prop('name'),
			count = 1,
			hidden_el = $('.' + view_more_of).find('.hidden'),
			count_hidden_el = hidden_el.length;
		
		hidden_el.each(function() {
			$(this).removeClass('hidden');
			
			if(count == count_hidden_el) {// && btn_obj.hasClass('load_more') == false
				btn_obj.remove();
				return false;
			}
			else if(count > 10)
				return false;
				
			count += 1;
		});
		
		//if(btn_obj.hasClass('load_more') == true && hidden_el.length == 0)
		//	...;
	});
	
	// search button
	$('.search_button a').click(function(e) {
		e.preventDefault();
		var form_obj = $(this).closest('form');
		
		if(form_obj.find('input#q').val() != '')
			form_obj.submit();
	});
	
	// initiate live search
	$('#search_input').liveSearch();
	
	// initiate similar questions
	//$('#question_title').liveSearch({id:'similar_questions', inputId:'question_title'});
	


    $('.share a').click(function(e) {
    	e.preventDefault();
		$('.share_modal').modal();
    });


	
	$('.modal .modal_tabs a').click(function(e) {
		e.preventDefault();
		var parent = $(this).closest('.modal');
			
		modal_toggle_tabs($(this), parent);
	});
	
	// upload picture modal
	$('a.edit_picture_link').click(function(e) {
		e.preventDefault();
		$('.upload_modal').modal();
	});
	
	// make anonymous
	$('.anonymous a').live('click', function(e) {
		e.preventDefault();
		var form_field = $(this).closest('form').find('input[name=anonymous]');
		
		$(this).closest('.row_submit').find('.logged_in_as').toggle();
		
		if($(this).hasClass('make_anonymous') == true)
			form_field.val(1);
		else
			form_field.val(0);	
	});
	
	// edit content
	$('a.inline_edit').live('click', function(e) {
		e.preventDefault();
		
		if($(this).hasClass('inline_edit_question') == true) {
			$(this).closest('.question').find('.inline_edit_content').toggle();
		} else {
			$(this).closest('.answer').find('.inline_edit_content').toggle();
		}
	});
	
	// show markdown help
	$('.show_markdown_tips').click(function(e) {
		e.preventDefault();
		$('.markdown_modal').modal();
	});
	
	// initiate the forms (validation)
	signup_form_init();
	login_form_init();
	forgot_password_form_init();
	answer_form_init();
	comment_form_init();
	//ask_form_init();
    notifications_form_init();
    share_form_init();
    upload_form_init();
    edit_account_form_init();
    edit_content_form_init();
});

function clear_form_errors(form_obj) {
	form_obj.find('span.error').remove();
	form_obj.find('.error').removeClass('error');
}

function twitter_modal() {
	twitter_form_init();
	$('#modal_twitter').modal();
}

function toggle_tabs(selected_tab, parent) {
	parent.find('li').removeClass('active');
	selected_tab.addClass('active');
}

function modal_toggle_tabs(selected_tab, modal) {
	var show_tab = selected_tab.attr('href').substr(1);
	
	modal.find('.modal_content').hide();
	modal.find('.' + show_tab).show();
	modal.find('.modal_tabs ul li').removeClass('active');
	selected_tab.parent().addClass('active');
}

function login_form_submit(form_obj, callback) {
	var button = form_obj.find('.row_submit button');
	start_request(button, form_obj);
	
	$.post(form_obj.prop('action'), form_obj.serialize(), function(data) {
		if(data.status == 'success') {
			if(form_obj.parent().hasClass('inline_auth') == true)
				process_login(data);
			else
				location.reload(true);
				
			if(form_obj.parent().hasClass('inline_auth_post_answer') == true)
				$("form[name=post_answer_form]").submit();
			else if(form_obj.parent().hasClass('inline_auth_post_question') == true)
				$("form[name=post_question_form]").submit();
		} else {
			end_request(button, form_obj);
			process_form_errors(form_obj, data);
		}
	}, 'json');
}

function signup_form_submit(form_obj, callback) {
	var button = form_obj.find('.row_submit button');
	start_request(button, form_obj);
	
	$.post(form_obj.prop('action'), form_obj.serialize(), function(data) {
		if(data.status == 'success') {
			if(form_obj.parent().hasClass('inline_auth') == true)
				process_login(data);
			else
				location.reload(true);
			
			if(form_obj.parent().hasClass('inline_auth_post_answer') == true)
				$("form[name=post_answer_form]").submit();
			else if(form_obj.parent().hasClass('inline_auth_post_question') == true)
				$("form[name=post_question_form]").submit();
		} else {
			end_request(button, form_obj);
			process_form_errors(form_obj, data);
		}
	}, 'json');
}

function forgot_password_form_submit(form_obj) {
	var button = form_obj.find('.row_submit button');
	start_request(button, form_obj);
	
	$.post(form_obj.prop('action'), form_obj.serialize(), function(data) {
		if(data.status == 'success') {
			process_forgot_password(form_obj, data);
		} else {
			end_request(button, form_obj);
			process_form_errors(form_obj, data);
		}
	}, 'json');
}

function comment_form_submit(form_obj) {
	var html = '';
	var button = form_obj.find('.row_submit button');
	start_request(button, form_obj);
	
	$.post(form_obj.prop('action'), form_obj.serialize(), function(data) {
		if(data.status == 'success')
			process_comment(form_obj, data);
		else
			process_form_errors(form_obj, data);
		end_request(button, form_obj);
	}, 'json');
}

function process_forgot_password(form_obj, data) {
	form_obj.replaceWith('<div class="notification success"><span>' + data.message + '</span></div>');
}

function process_login(data) {
	u = data.user;
	
	$.modal.close();
	
	// inline auth
	$('.inline_auth').remove();
	$('button.inline_auth_submit').removeClass('inline_auth_submit');
	
	// post answer/question form
	if(s.anonymous == 0)
	{
	    $('form[name=post_answer_form]').append('<div class="row_submit"><div class="actions logged_in_as"><span class="user_picture"><img width="25" height="25" src="' + u.profile_pic + '"></span><span class="user_info">Logged in as <a href="/' + u.slug + '"><strong>' + u.name + '</strong></a></span></div><button type="submit">Post Answer</button></div>');
	    $('form[name=post_question_form]').append('<div class="row_submit"><div class="actions logged_in_as"><span class="user_picture"><img width="25" height="25" src="' + u.profile_pic + '"></span><span class="user_info">Logged in as <a href="/' + u.slug + '"><strong>' + u.name + '</strong></a></span></div><button type="submit">Post Question</button></div>');
	}
	else
	{
		$('form[name=post_answer_form]').append('<div class="row_submit"><div class="actions logged_in_as"><span class="user_picture"><img width="25" height="25" src="' + u.profile_pic + '"></span><span class="user_info">Logged in as <a href="/' + u.slug + '"><strong>' + u.name + '</strong></a><span class="divide">&middot;</span><span class="anonymous"><a href="#" class="make_anonymous">Post as Anonymous</a></span></span></div><div class="actions logged_in_as hidden"><span class="user_info">Anonymous<span class="divide">&middot;</span><span class="anonymous"><a href="#" class="make_public">Post as ' + data.user.name +'</a></span></div><button type="submit">Post Answer</button></div>');
	    $('form[name=post_question_form]').append('<div class="row_submit"><div class="actions logged_in_as"><span class="user_picture"><img width="25" height="25" src="' + u.profile_pic + '"></span><span class="user_info">Logged in as <a href="/' + u.slug + '"><strong>' + u.name + '</strong></a><span class="divide">&middot;</span><span class="anonymous"><a href="#" class="make_anonymous">Post as Anonymous</a></span></span></div><div class="actions logged_in_as hidden"><span class="user_info">Anonymous<span class="divide">&middot;</span><span class="anonymous"><a href="#" class="make_public">Post as ' + data.user.name +'</a></span></div><button type="submit">Post Question</button></div>');
	}
}

function process_connect(type) {
	if(type == 'facebook')
	{
		$('button.facebook.connect_with').remove();
		$('form[name=form_share_fb]').show();
	}
}

function process_form_errors(form_obj, data) {
	form_obj.find('span.error').remove();
	form_obj.find('.notification').remove();
	
	if(data.message) {
		form_obj.prepend('<div class="notification error"><span>' + data.message + '</span></div>');
	}

	if(data.errors) {
		$.each(data.errors, function(key, value) {
			var element_id = form_obj.find('input[name=' + key + ']').prop('id');
			form_obj.find('label[for=' + element_id + ']').append('<span class="error">' + value + '</span>');
			//form_obj.find('label[for=' + key + ']').append('<span class="error">' + value + '</span>');
			//form_obj.find('input[name=' + key + ']').closest('label').append('<span class="error">' + value + '</span>');
		});
	}
}

function process_vote(object, data) {
	var type = object.parent().prop('class'),
		parent = object.closest('.points'),
		count_obj = parent.find('.count'),
		label_obj = parent.find('.label'),
		points = Number(count_obj.text());
	
	if(type == 'plus')
		points += 1;
	else
		points -= 1;
	
	if(points == 1)
		label_obj.text('Point');
	else
		label_obj.text('Points');
	
	count_obj.text(points);
	parent.find('.vote').remove();
}

function process_follow(object) {
	var parent = object.parent(),
		url = object.prop('href'),
		text = object.html();
	
	if(parent.hasClass('unfollow')) {
		parent.removeClass('unfollow');
		text = text.replace('Unfollow', 'Follow');
		url = url.replace('delete','new');
	} else {
		parent.addClass('unfollow');
		object.text('Unfollow');
		text = text.replace('Follow', 'Unfollow');
		url = url.replace('new','delete');
		
		if(parent.hasClass('question_action')) {
			object.append('<span class="image"></span>');
		}
	}
	object.html(text);
	object.prop('href', url);
}

function process_thank(object) {
	object.parent().addClass('thanked');
	object.replaceWith('Thanked');
}

function process_report(object) {
	object.parent().addClass('reported');
	object.replaceWith('Reported');
}

function process_comment(form_obj, data) {
	var html = '';
	html += '<div class="comment" id="comment_' + data.comment.id + '"><p>' + data.comment.body + '</p><div class="meta">';
	html += '<span class="user_info"><a href="/' + data.comment.slug + '">' + data.comment.display_name + '</a><span class="divide">&middot;</span>';
	html += 'just now</span></div></div>';
	
	form_obj.before(html);
	$('#comment_' + data.comment.id).effect('highlight',{}, 2000);
	$(':input',form_obj).not(':button, :submit, :reset, :hidden').val('');
}

function process_picture_upload(data) {
    if(data.status == 'success')
    {
        $('.picture_large img').attr('src', data.profile_pic_large + '?' + new Date().getTime());
        $('.picture_thumb img').attr('src', data.profile_pic_thumb + '?' + new Date().getTime());
        $.modal.close();
    }
    else
        process_form_errors($('#upload_form'), data);
}

function process_content_edit(form_obj, data) {
	if(form_obj.hasClass('edit_question') == true) {
		var parent_content = form_obj.closest('.question_content');
		parent_content.find('.submitted_content').html(data.question.body);
	} else if(form_obj.hasClass('edit_answer') == true) {
		var parent_content = form_obj.closest('.answer_content');
		parent_content.find('.submitted_content').html(data.answer.body);
	}
	
	parent_content.find('.inline_edit_content').toggle();
}

function login_form_init() {
	var login_form_obj = $("form.login_form");

	$.each(login_form_obj, function() {		
		var form_obj = $(this);
		
		form_obj.validate({
			rules: {
				email: "required",
				password: "required"
			},
			messages: {
				email: {required: "All fields are required"},
				password: {required: "All fields are required"}
			},
			errorPlacement: function(error, element) {
				error.appendTo(element.parent().find('label'));
			},
			errorElement: 'span',
			submitHandler: function() {
				login_form_submit(form_obj);
			}
		});
	});
}

function signup_form_init() {
	var signup_form_obj = $("form.signup_form");
	
	$.each(signup_form_obj, function() {
		var form_obj = $(this);
			
		form_obj.validate({
			rules: {
				name: "required",
				password: {required: true, minlength: 4},
				email: {required: true, email: true}
			},
			messages: {
				name: "Full name is required", 
				password: {required: "Password is required", rangelength: jQuery.format("Enter at least {0} characters")},
				email: {required: "A valid email is required", email: "Please enter a valid email address"}
			},
			errorPlacement: function(error, element) {
				error.appendTo(element.parent().find('label'));
			},
			errorElement: 'span',
			submitHandler: function() {
				signup_form_submit(form_obj);
			}
		});
	});
}

function forgot_password_form_init() {
	var forgot_password_form_obj = $("form.forgot_password_form");

	$.each(forgot_password_form_obj, function() {		
		var form_obj = $(this);
		
		form_obj.validate({
			rules: {
				email: "required"
			},
			messages: {
				email: {required: "All fields are required"}
			},
			errorPlacement: function(error, element) {
				error.appendTo(element.parent().find('label'));
			},
			errorElement: 'span',
			submitHandler: function() {
				forgot_password_form_submit(form_obj);
			}
		});
	});
}
function twitter_form_init() {
	var form_obj = $("form.twitter_form");
	
	form_obj.validate({
	    rules: {
	    	email: {required: true, email: true}
	    },
	    messages: {
	    	email: {required: "A valid email is required", email: "Please enter a valid email address"}
	    },
	    errorPlacement: function(error, element) {
	    	error.appendTo(element.parent().find('label'));
	    },
	    errorElement: 'span',
	    submitHandler: function() {
	    	twitter_form_submit(form_obj);
	    }
	});
}

function upload_form_init() {
	var form_obj = $("form.upload_form");
	
	$(form_obj).ajaxForm({
	    dataType: 'json',
	    beforeSubmit: validate_picture,
	    success: function(data) {
	    	process_picture_upload(data);
	    }
	});
}

function validate_picture(form_data, form) {
	var form = form[0];
	if ( ! form.picture.value)
        return false; 
}


function comment_form_init() {
	var comment_form_obj = $("form.comment_form");

	$.each(comment_form_obj, function() {		
		var form_obj = $(this);
		
		form_obj.validate({
			rules: {
				body: "required"
			},
			messages: {
				body: {required: "Comment body cannot be empty"},
			},
			errorPlacement: function(error, element) {
				error.prependTo(element.parent());
			},
			errorElement: 'span',
			submitHandler: function() {
				comment_form_submit(form_obj);
			}
		});
	});
}

// BLARGH

//END BLARGH


function answer_form_submit(form_obj) {
	var button = form_obj.find('.row_submit button');
	start_request(button, form_obj);
	
        $.post("/answers/create", form_obj.serialize(), function(data) {
		if(data.status == 'success') {
			location.href = data.url;
			location.reload(true);
		} else {
			process_form_errors(form_obj, data);
			end_request(button, form_obj);
		}
	}, 'json');
}

function ask_form_submit(form_obj) {
	var button = form_obj.find('.row_submit button');
	start_request(button, form_obj);
	
	$.post(form_obj.prop('action'), form_obj.serialize(), function(data) {
		if(data.status == 'success') {
			location.href = '/' + data.slug;
		} else {
			process_form_errors(form_obj, data);
			end_request(button, form_obj);
		}
	}, 'json');
}

function twitter_form_submit(form_obj) {
	var button = form_obj.find('.row_submit button');
	start_request(button, form_obj);
	
	$.post(form_obj.prop('action'), form_obj.serialize(), function(data) {
		if(data.status == 'success') {
			if(form_obj.hasClass('inline_auth') == true)
				process_login(data);
			else
				location.reload(true);
		} else {
			process_form_errors(form_obj, data);
			end_request(button, form_obj);
		}
	}, 'json');
}

function share_form_submit(form_obj) {
	var button = form_obj.find('.row_submit button');
	start_request(button, form_obj);
	
	$.post(form_obj.prop('action'), form_obj.serialize(), function(data) {
		if(data.status == 'success') {
			form_obj.replaceWith('<div class="notification success"><span>Thanks for sharing!</span></div>');
		} else {
			process_form_errors(form_obj, data);
			end_request(button, form_obj);
		}
	}, 'json');
}



function edit_content_submit(form_obj) {
	var button = form_obj.find('.row_submit button');
	start_request(button, form_obj);
	
	$.post(form_obj.prop('action'), form_obj.serialize(), function(data) {
		if(data.status == 'success') {
			process_content_edit(form_obj, data);
		} else {
			process_form_errors(form_obj, data);
		}
		
		end_request(button, form_obj);
	}, 'json');
}

/***********************************/
/* MOVED TO THE QUESTION SHOW VIEW */
/***********************************/
/*
function ask_form_init() {
	var form_obj = $("form[name=post_question_form]");	
	
	// initialize topics autocomplete
	$(".topics_ac").tokenInput("/search/topics_ac");
	
	form_obj.submit(
		function() {
			tinyMCE.triggerSave();			
		}).validate({
		ignore: "",
	    rules: {
	    	title: {required: true, minlength: 15, maxlength: 140},
	    	body: "required",
	    	topics: {required: true, maxTopics: true}
	    },
	    messages: {
	    	title: {required: "A question title is required", minlength: "Question titles must be at least 15 characters", maxlength: "Question titles cannot exceed 140 characters"},
	    	body: {required: "A question body is required"},
	    	topics: {required: "At least one topic must be entered", maxTopics: "Maximum of 5 topics are allowed"}
	    },
	    errorPlacement: function(error, element) {
	    	error.appendTo(element.closest('.row').find('label'));  	
	    },
	    errorElement: 'span',
	    submitHandler: function() {
	    	ask_form_submit(form_obj);
	    }
	});
}
*/

function answer_form_init() {
	var form_obj = $("form[name=post_answer_form]");	

	form_obj.submit(
		function() {
			tinyMCE.triggerSave();
		}).validate({
		ignore: "",	
		rules: {
	    	body: "required"
	    },
	    messages: {
	    	body: {required: "An answer body is required"},
	    },    
	    errorPlacement: function(error, element) {
	    	error.appendTo(element.closest('.row').find('label'));
	    },
	    errorElement: 'span',
	    submitHandler: function() {
	    	answer_form_submit(form_obj);
	    }
	});
}

function share_form_init() {
	var share_form_obj = $(".share_modal form:not(#linkedin_share_form");
	
	$.each(share_form_obj, function() {		
		var form_obj = $(this);
		
		form_obj.validate({
			rules: {
				share_body: "required"
			},
			messages: {
				share_body: {required: "You must enter something to share"},
			},
			errorPlacement: function(error, element) {
				error.appendTo(element.parent().find('label'));
			},
			errorElement: 'span',
			submitHandler: function() {
				share_form_submit(form_obj);
			}
		});
	});
}



function edit_account_form_init() {
	var form_obj = $("form[name=edit_account_form]");
	
	form_obj.validate({
	    rules: {
		   email: {required: true, email: true}
		},
		messages: {
		   email: {required: "A valid email is required", email: "Please enter a valid email address"}
		},
	    errorPlacement: function(error, element) {
	    	error.appendTo(element.parent().find('label'));
	    },
	    errorElement: 'span',
	    submitHandler: function() {
	    	edit_profile_form_submit(form_obj);
	    }
	});
}

function edit_content_form_init() {
	var edit_form_obj = $("form.edit_content_form");	

	$.each(edit_form_obj, function() {		
		var form_obj = $(this);
		
		form_obj.submit(
			function() {
				tinyMCE.triggerSave();
			}).validate({
			rules: {
	    		body: "required"
	    	},
	    	messages: {
	    		name: {required: "A body is required"},
	    	},
		    errorPlacement: function(error, element) {
		    	error.appendTo(element.parent().find('label'));
		    },
		    errorElement: 'span',
		    submitHandler: function() {
		    	edit_content_submit(form_obj);
		    	//answer_form_submit(form_obj);
		    }
		});
	});
}

function auth_facebook(btn_obj) {
	$.getJSON('/login/facebook', function(data) {		
	    if(data.status == 'success') {
	    	if(btn_obj.hasClass('inline_auth') == true)
				process_login(data);
			else
				location.reload(true);
	    }
	    else {
	    	//alert(result.message);
	    }
	});
}

function connect_facebook() {
	$.getJSON('/users/connect/facebook', function(data) {		
	    if(data.status == 'success')
	    	process_connect('facebook');
	});
}

function picture_facebook() {
	$.getJSON('/users/picture/facebook', function(data) {		
	    if(data.status == 'success')
	    	process_picture_upload(data);
	});
}

function picture_gravatar(id_to_change)
{
    $.getJSON('/users/picture/gravatar', function(data)
    {
	if(data.status == 'success')
	    {
	    document.getElementById(id_to_change).src = data.profile_pic_large;
	    $.modal.close();
	    }
    });
}

function content_highlight(content) {
	$('#' + content).effect('highlight',{}, 2000);
}

function notification_message(type, message) {
	var html;
	
	if(type == 'success')
		html = '<div class="top_notification success" style="display:none"><span>' + message + '</span></div>';
	else if(type == 'error')
		html = '<div class="top_notification error" style="display:none"><span>' + message + '</span></div>';
		
	$('body').prepend(html);
	$('.top_notification').slideDown(1000).delay(2000).slideUp(1000, function(){$(this).remove()});
}

function notifications_form_submit(form_obj, callback) 
{
	$.post('/users/update_notifications/', form_obj.serialize(), function(data) {
    	notification_message(data.status, data.message);
	}, 'json');
}

function notifications_form_init() 
{
	var notification_form_obj = $("form[name=edit_notifications_form]");
	
	notification_form_obj.submit(function(e) {
		e.preventDefault();
		notifications_form_submit(notification_form_obj);
	});
}

function start_request(button, form_obj) {
	form_obj.addClass('disabled');/*.prepend('<span class="loader"></span>');*/
	button.addClass('disabled').prop('disabled','disabled');
}

function end_request(button, form_obj) {
	form_obj.removeClass('disabled').find('.loader').remove();
	button.removeClass('disabled').removeAttr('disabled');
}

jQuery.validator.addMethod("maxTopics", function(value, element) {
	var topics = value.split(',');
	return this.optional(element) || (topics.length < 6);
}, "Maximum of 5 topics are allowed");


// live search functionality
jQuery.fn.liveSearch = function (conf) {
	var CONFIG = jQuery.extend({
		url:					'/search/live', 
		id:						'live_search',
		inputId:				'q',
		duration:				400, 
		typeDelay:				200,
		loadingClass:			'loading', 
		onSlideUp:				function () {}, 
		updatePosition:			false,
		selected_item_class:	'selected'		
	}, conf);
	
	var KEY = {
	    BACKSPACE: 8,
	    TAB: 9,
	    ENTER: 13,
	    ESCAPE: 27,
	    SPACE: 32,
	    PAGE_UP: 33,
	    PAGE_DOWN: 34,
	    END: 35,
	    HOME: 36,
	    LEFT: 37,
	    UP: 38,
	    RIGHT: 39,
	    DOWN: 40,
	    NUMPAD_ENTER: 108,
	    COMMA: 188
	};

	var live_search	= $('#' + CONFIG.id);
	var selected_item = null;

	// Close live-search when clicking outside it
	$(document.body).click(function() {
	    live_search.hide().empty();
	});

	return this.each(function () {
		var input = jQuery('#' + CONFIG.inputId).attr('autocomplete', 'off');
		var container = jQuery(this);

		var showlive_search = function (data, query) {			
			live_search.empty();
			
			if(data.length) {
				var dropdown_ul = $("<ul></ul>")
					.appendTo(live_search)
					.mouseover(function (event) {
            	        select_item($(event.target).closest("li"));
            	    }); 
            	   
				$.each(data, function(key, value) {
					var li = $('<li><a href="/' + value.slug + '">' + highlight_query(value.title, query) + '</a></li>').appendTo(dropdown_ul);
					
					if(key == 0)
						select_item(li);
				});
				
				// add the "search for..." at the bottom
				var li = $('<li class="search_for"><a href="/search?q=' + escape(query) + '">Search for <strong>' + query + '</strong></a></li>').appendTo(dropdown_ul);
			}
			else {
				var dropdown_ul = $("<ul></ul>").appendTo(live_search);
				var li = $('<li class="no_results">No results found for <strong>' + query + '</strong></li>').appendTo(dropdown_ul);
			}
				
			live_search.show();
		};

		// Hides live-search for this input
		var hidelive_search = function () {
			live_search.hide().empty();
		};
		
		input
			.keyup(function(event) {
    		    var query = this.value;
    		    
    		    switch(event.keyCode) {
                	case KEY.LEFT:
                	case KEY.RIGHT:
                	case KEY.UP:
                	case KEY.DOWN:		
    		    		var item = null;
    		    		var items = live_search.find('li');

                        if(event.keyCode === KEY.DOWN || event.keyCode === KEY.RIGHT)
                            item = $(selected_item).next();
                        else
                            item = $(selected_item).prev();
                        
                        if(item.length)
                            select_item(item);
                        else if(item.length == 0 && event.keyCode === KEY.DOWN)
                        	select_item($(items[0]));
                        else
                        	select_item($(items[items.length - 1]));
                        	
    		    		break;
    		    	case KEY.ESCAPE:
                  		hidelive_search();
                  		return true;
                  	case KEY.ENTER:
                  		if(selected_item) { 
                  			location.href = $(selected_item).find('a').prop('href');
                  			return false;
                  		}
                  		break;
    		    	default:
    		    		if (this.timer)
    		    		    clearTimeout(this.timer);
						
						if(query.length > 1 && query != '') {
    		    			this.timer = setTimeout(function () {
    		    				$.getJSON(CONFIG.url,{q:query}, function(data) {
    		   					 	if(data)
    		   					 	    showlive_search(data, query);
    		    			        else
    		    			            hidelive_search();
    		   					});
    		    			}, CONFIG.typeDelay);
    		    		} else
    		    			hidelive_search();
    		    }
			});
		
		// Highlight an item in the results dropdown
    	function select_item(item) {
    	    if(item) {
    	        if(selected_item) {
    	            deselect_item($(selected_item));
    	        }
    	        item.addClass(CONFIG.selected_item_class);
    	        selected_item = item.get(0);
    	    }
    	}
    	
    	function deselect_item(item) {
			item.removeClass(CONFIG.selected_item_class);
    	    selected_item = null;
    	}
    	
    	// Highlight the query part of the search term
    	function highlight_query(value, term) {
        	return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<b>$1</b>");
    	}
	});
};