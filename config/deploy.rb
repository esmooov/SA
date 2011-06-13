set :application, "conversation"
set :domain, "50.57.67.98"
set :user, "ubuntu"
set :ssh_options, { :forward_agent => true }
set :scm, :git
set :branch, 'master'
set :scm_verbose, true
set :use_sudo, false
set :repository,  "git@github.com:tpm/conversation-ad.git"
default_environment['PATH'] = "/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/sbin:/sbin:/usr/local/bin:/usr/lib64/ruby/gems/1.8/bin:/bin:/usr/bin:/usr/local/bin:/usr/lib64/ruby/gems/1.8/bin:/root/bin:/bin:/usr/sbin"

role :app, domain
role :web, domain
set :deploy_to, "/var/cap/#{application}"


# If you are using Passenger mod_rails uncomment this:
# if you're still using the script/reapear helper you will need
# these http://github.com/rails/irs_process_scripts

default_run_options[:pty] = true

namespace :deploy do
  task :start, :roles => :app do
  end
  
  task :stop, :roles => :app do
  end
  
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
  
end

task :relink do
  sudo "ln -nfs #{shared_path}/feeds #{release_path}/public/feeds"
end

after "deploy:symlink", :relink
