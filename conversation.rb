require 'environment'

redis = Redis.new
redis.select 7

get '/' do
  erb :conversation_ad
end

get '/qunit' do
  erb :qunit
end

get '/blog_entries' do
  callback = Spam.sanitize_callback(params[:callback] || "")
  xml = XmlSimple.xml_in(File.expand_path(File.join(File.dirname(__FILE__),'.','public/feed.xml')))
  q = xml.to_json
  "#{callback}(#{q})"
end

post '/convo_msg' do
  check = Spam.checkIP(redis,request.host)
  callback = Spam.sanitize_callback(params[:callback] || "")
  if check[0]
    Pony.mail(:to => 'twotonmary@gmail.com',
              :from => 'conversation-ad-mailer@talkingpointsmemo.com',
              :subject => "Message from TPM User #{params[:name]}",
              :body => params[:message]
    )
    q = {:ip => check[0], :attempts => check[1]["attempts"]}.to_json
  else
    q = {:error => check[1]}.to_json
  end
  
  "#{callback}(#{q})"
end
