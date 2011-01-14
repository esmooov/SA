require 'rubygems'
require 'sinatra'
require 'yajl/json_gem'
require 'pony'
require 'redis'
require 'xmlsimple'
require 'sanitize'
require File.expand_path(File.join(File.dirname(__FILE__),'.','lib/spam.rb'))

APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__),'.'))
