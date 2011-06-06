require 'rubygems'
require File.expand_path(File.dirname(__FILE__) + "/conversation")

set :run, false
set :environment, :development

log = File.new("/tmp/sinatra.log", "a")
STDOUT.reopen(log)
STDERR.reopen(log)
log.close


# use Rack::ResponseHeaders do |headers|
#     headers['Cache-Control'] = "public, max-age=3600"
# end
# 
# set :root, APP_ROOT
# set :public, File.join(APP_ROOT, 'public')
# set :cache_enabled, true
# set :cache_environment, :production
# set :cache_output_dir, File.join(APP_ROOT, 'public', 'cache')


run Sinatra::Application
