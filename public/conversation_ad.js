$(function(){
    window.Convo = {};
    Convo = {
        
        template: _.template($('#conversation-ad-template').html()),

        expand: function(){
            $('conversation-ad-feedback').stop(true,true);
            $('conversation-ad-body-mask').stop(true,true);
            $('conversation-ad-input').stop(true,true);
            if (!Convo.expanded){
                Convo.expanded=true;
                $('#conversation-ad-feedback').animate({height:String(Convo.avg_height)},200,function(){
               
                    $('#conversation-ad-minimizer').show();
                    $('#conversation-ad-input').css({overflow:"auto"})
                        .animate({width:"270px",height:"150px"},200);
                    $('#conversation-ad-name').show();
                });

                $('#conversation-ad-body-mask').animate({height:String(Convo.avg_height)},200,function(){
                });
            }
        },

        minimize: function(callback){
            $('conversation-ad-feedback').stop(true,true);
            $('conversation-ad-body-mask').stop(true,true);
            $('conversation-ad-input').stop(true,true);
            if (Convo.expanded === true){
                Convo.expanded=false;
                $('#conversation-ad-minimizer').hide();
                $('#conversation-ad-name').hide();
                $('#conversation-ad-input').css({overflow:"hidden"})
                .animate({width:"200px",height:"10px"},200,function(){
                    $('#conversation-ad-feedback').animate({height:Convo.feedback_height},200);
                    $('#conversation-ad-body-mask').animate({height:Convo.mask_height},200,callback);
                });
            } else {
                if (callback){callback();}
            } 
        },

        reset: function(){
            $('conversation-ad-feedback').stop(true,true);
            $('conversation-ad-body-mask').stop(true,true);
            $('conversation-ad-input').stop(true,true);
            $('#conversation-ad-alert').hide();
            $('#conversation-ad-minimizer').hide();
            $('#conversation-ad-name').hide();
            $('#conversation-ad-input').css({overflow:"hidden"}).height(10).width(200);
            $('#conversation-ad-feedback').height(Convo.feedback_height);
            $('#conversation-ad-body-mask').height(Convo.mask_height);
            Convo.expanded = false;
        },

        show_flash: function(status,message){
            var msg_class = (status === 0 ? "infinite_frowns" : "infinite_smiles")
            $('#conversation-ad-alert').attr('class',msg_class)
                .html(message)
                .show();
            setTimeout(function(){
                $('#conversation-ad-alert').hide();
            },10000);
        
        },

        validate: function(name,message){
            if (name === ""){
                Convo.minimize(function(){
                    Convo.show_flash(0,"You didn't specify a name. Please try again.");
                });
                return false;
            } else if(message === "" || message === "I was wondering ..."){
                Convo.minimize(function(){
                    Convo.show_flash(0, "You must enter a messsage. Please try again.");
                });
                return false;
            } else {
                return true;
            }
        },

        post_message: function(name,message,callback){
            $.ajax({
                type: "POST",
                url: "/convo_msg",
                data: {
                    name: name,
                    message: message
                },
                dataType: "jsonp",
                success: function(data, textStatus, XMLHttpRequest){
                    callback(data);
                }
            });
        },

        get_entries: function(callback){
            $.ajax({
                type: "GET",
                url: "/feeds/feed.json",
                dataType: "json",
                success:function(data){
                    Convo.entries = data.channel[0].item;
                    callback();
                }
            });             
        },

        parse_entries:function(){
            $('#conversation-ad-body').empty(); 
            _(Convo.entries).each(function(item){
                item.description = Convo.enparagraph(item.description[0]);
                var entry = Convo.template(item);
                $('#conversation-ad-body').append(entry);
            });              
            
            Convo.feedback_height = $('#conversation-ad-feedback').height();
            Convo.mask_height = $('#conversation-ad-body-mask').height();
            Convo.body_height = $('#conversation-ad-body').height();
            Convo.avg_height = (Convo.feedback_height + Convo.mask_height)/2;
            Convo.scroll_speed = (Convo.body_height/1000)*5000;
        },

        enparagraph: function(text){
            var text = text.replace(/\n/g,"</p><p>"),
                output = "<p>"+text+"</p>" ;
            return output;
        }
    }


    $('.down-scroller').hover(function(){
        var mask_height = $('#conversation-ad-body-mask').height(),
            max_scroll = -1 * (Convo.body_height - mask_height),
            scroll_progress = $('#conversation-ad-body').position().top / max_scroll,
            speed = Convo.scroll_speed * (1-scroll_progress);
        $('#conversation-ad-body').animate({top:String(max_scroll)},speed,'linear');
    },function(){
        $('#conversation-ad-body').stop(true,false);
    });
    
    $('.up-scroller').hover(function(){
        var mask_height = $('#conversation-ad-body-mask').height(),
            max_scroll = -1 * (Convo.body_height - mask_height),
            scroll_progress = $('#conversation-ad-body').position().top / max_scroll,
            speed = Convo.scroll_speed * scroll_progress;
        $('#conversation-ad-body').animate({top:0},speed,'linear');
    },function(){
        $('#conversation-ad-body').stop(true,false);
    });

    $('#conversation-ad-input').focus(function(){
        Convo.expand();
    });
    
    $('#conversation-ad-minimizer').click(function(){
        $(this).hide();
        Convo.minimize();
    });

    $('#conversation-ad-send').click(function(){
        var name = $('#conversation-ad-name-input').val(),
            message = $('#conversation-ad-input').val(),
            validate = Convo.validate(name,message);
            if (validate === true){
                Convo.post_message(name,message,function(data){
                    if (data["error"]){
                        Convo.minimize(function(){
                            Convo.show_flash(0, data["error"]);
                        });
                        Convo.status = data;
                    } else {
                        Convo.minimize(function(){
                            Convo.show_flash(1, "Your message has been sent.");
                        });
                        Convo.status = data;
                    }
                });
            }
        });

    Convo.get_entries(function(){
        Convo.parse_entries();
    });
});



