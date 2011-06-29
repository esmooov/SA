require 'environment'

redis = Redis.new
redis.select 7

COMPANIES = {"currenttv" => {:to => 'twotonmary@gmail.com',
              :from => 'conversation-ad-mailer@talkingpointsmemo.com',
              :subject => "To: KEITH From: TPM READER ",
              :body => ""},
             "boeing" => {}}

get '/:company' do
  erb params[:company].intern
end

post '/:company/convo_msg' do
  check = Spam.checkIP(redis,request.host)
  callback = Spam.sanitize_callback(params[:callback] || "")
  mail_params = COMPANIES[params[:company]]
  mail_params[:subject] = mail_params[:subject] + params[:name]
  mail_params[:body] = params[:message]
  if check[0]
    Pony.mail(mail_params)
    q = {:ip => check[0], :attempts => check[1]["attempts"]}.to_json
  else
    q = {:error => check[1]}.to_json
  end
  
  "#{callback}(#{q})"
end
