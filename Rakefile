require 'rake'
require 'environment'
require 'rest_client'

namespace :fetch do
  desc "fetch new feed"
  task :currenttv do
    xml = RestClient.get 'http://current.com/shows/countdown/rssfeed/'
    xml.gsub!(/\&/,"and")
    xml = XmlSimple.xml_in(xml)
    xml["channel"][0]["item"] = xml["channel"][0]["item"].map do |q| 
      q["pubDate"][0] = Date.parse(q["pubDate"][0]).strftime("%b %d &mdash; %I:%M %p")
      q
    end
    xml["channel"][0]["item"] = xml["channel"][0]["item"].select{|q| q["description"][0].class == String}
    q = xml.to_json
    File.open("#{APP_ROOT}/public/feeds/currenttv.json","w+"){|f| f.write(q)}
  end
end
