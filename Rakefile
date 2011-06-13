require 'rake'
require 'environment'
require 'rest_client'

namespace :fetch do
  desc "fetch new feed"
  task :feed do
    xml = RestClient.get 'http://projecteuler.net/rss2_euler.xml'
    xml = XmlSimple.xml_in(xml)
    q = xml.to_json
    File.open("#{APP_ROOT}/public/feeds/feed.json","w"){|f| f.write(q)}
  end
end
