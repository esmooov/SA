require 'rspec'
require '../environment'

r = Redis.new
r.select 7

describe "IP limiter" do
    it "creates a new entry if no matching ip is found" do
        time = Time.now.to_i
        Spam.setExpireOrFind("127.6.9.4",60,"ip",r)
        user = r.hgetall("ip:127.6.9.4")
        user.should have(2).items
        user["expire"].should eq((time+60).to_s)
        user["attempts"].should eq("1")
        r.del "ip:127.6.9.4"
    end

    it "increments user attempts" do
        4.times{Spam.checkIP(r,"127.6.9.4")}
        user = r.hgetall("ip:127.6.9.4")
        user["attempts"].should eq("4")
        r.del "ip:127.6.9.4"
    end

    it "blocks more than one attempt in a minute" do
        Spam.checkIP(r,"127.6.9.4")
        check = Spam.checkIP(r,"127.6.9.4")
        check[0].should eq(nil)
        check[1].should eq("You must wait a minute between requests.")
        r.del "ip:127.6.9.4"
    end

    it "bans users that have messaged ten times in a minute" do
        10.times{Spam.checkIP(r,"127.6.9.4")}
        time = Time.now.to_i
        user = r.hgetall("banned:127.6.9.4")
        user.should have(2).items
        user["expire"].should eq((time+604800).to_s)
        user["attempts"].should eq("1")
        r.del("ip:127.6.9.4")
        r.del("banned:127.6.9.4")
    end
end

describe "spam blocker" do
    it "Blocks emails with html" do
        message = Spam.sanitizeMessage("hey exxon <a href='foo'>nice</a>")
        message.should eq("No HTML is allowed in your message.")
    end

    it "Blocks emails with javascript" do
        message = Spam.sanitizeMessage("Hey exxon javascript:doBadStuff();")
        message.should eq("Javascript is not allowed in your message.")
    end
end
