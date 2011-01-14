module("Parsing");

    test("enparagraphs",function(){
        var text = "hey\nyou",
            output = Convo.enparagraph(text);
        equal(output,"<p>hey</p><p>you</p>");
     });

    test("writes in xml",function(){
        var squib_data = [
            {
                title: "Foo",
                description: ["Bar Baz"],
                link: "http://www.example.com"
            },
            {
                title: "Talking",
                description: ["Points Memo"],
                link: "http://www.talkingpointsmemo.com"
            }
        ];
        Convo.entries = squib_data;
        Convo.parse_entries();
        equal($('#conversation-ad-body .tpm_inside_hed a').eq(0).html(), "Foo", "Correct first headline.");
        equal($('#conversation-ad-body .tpm_inside_hed a').eq(1).html(), "Talking", "Correct second headline.");
        equal($('#conversation-ad-body .tpm_inside_hed a').eq(0).attr("href"), "http:\/\/www.example.com", "Correct first link.");
        equal($('#conversation-ad-body .tpm_inside_hed a').eq(1).attr("href"), "http:\/\/www.talkingpointsmemo.com", "Correct second link.");
        equal($('#conversation-ad-body .conversation-ad-entry').eq(0).html(), "<p>Bar Baz<\/p>", "Correct first body.");
        equal($('#conversation-ad-body .conversation-ad-entry').eq(1).html(), "<p>Points Memo<\/p>", "Correct second body.");
    });

module("Validation");
    
    test("Validates name", function(){
        var validate = Convo.validate("","Hey guys");
        equal (validate, false, "A blank name is invalid");
    });
    
    test("Validates message", function(){
        var validate = Convo.validate("Erik","");
        equal (validate, false, "A blank message is invalid");
        var validate = Convo.validate("Erik","I was wondering ...");
        equal (validate, false, "A blank message is invalid");
    });

//module("Ajax");

    //asyncTest("Successfully posts",function(){
        //Convo.post_message("Erik","How are you?",function(data){
            //Convo.status = data;
            //equal (Convo.status["ip"],"127.0.0.1","Successfully posts and receives ip");
            //start(); 
        //});
    //});

    //asyncTest("Successfully errors",function(){
        //Convo.post_message("Erik","How are you?",function(data){
            //Convo.status = data;
            //ok (Convo.status["error"],"Receives error after posting twice in a row");
            //start();
        //});
    //});

module("DOM");

    asyncTest("Input expands on focus",function(){
        Convo.reset();
        $('#conversation-ad-input').focus();
        setTimeout(function(){
            var input_height = $('#conversation-ad-input').height();
            equal(input_height,150, "Conversation ad input is expanded");
            start();
        },600);
    });

    setTimeout(function(){
        Convo.reset();
        asyncTest("Input minimizes on minimizer",function(){
            $('#conversation-ad-input').focus();
            setTimeout(function(){
                $('#conversation-ad-minimizer').click();
                setTimeout(function(){
                    var input_height = $('#conversation-ad-input').height();
                    equal(input_height,10, "Conversation ad input is minimized");
                    start();
                },600);
            },600)
        });
    },1000);

