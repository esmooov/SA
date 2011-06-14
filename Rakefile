require 'rake'
require 'environment'
require 'rest_client'

namespace :fetch do
  desc "fetch new feed"
  task :feed do
    xml = RestClient.get 'http://current.com/shows/countdown/rssfeed/'
    xml = XmlSimple.xml_in(xml)
    q = xml.to_json
    File.open("#{APP_ROOT}/public/feeds/feed.json","w+"){|f| f.write(q)}
  end
end
