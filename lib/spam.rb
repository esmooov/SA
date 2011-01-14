class Spam
    
  def self.sanitize_callback(callback)
      callback=~/^(.{5}?)(\d?)/
      return nil if callback.length == 0
      return nil if $1 != "jsonp"
      return nil if $2 == ""
      return nil if callback.length > 128
      return callback
  end
  
    def self.setExpireOrFind(ip,time,field,redis)
        user = redis.hgetall "#{field}:#{ip}"
        expire = Time.now.to_i + time
        if user.empty? || user["expire"].to_i < Time.now.to_i
            redis.hset("#{field}:#{ip}","expire",expire)
            redis.hset("#{field}:#{ip}","attempts",1)
            return {"expire" => expire, "attempts" => "1"}
        else
            redis.hincrby("#{field}:#{ip}","attempts",1)
            return redis.hgetall("#{field}:#{ip}")
        end
        
    end

    def self.checkIP(redis,ip)
        user = Spam.setExpireOrFind(ip,60,"ip",redis)
        case (user["attempts"] || "0").to_i
            when nil, 0 then return [nil,"Something went wrong. Please retry later."]
            when 1 then return [ip,user]
            when 2..9 then return [nil,"You must wait a minute between requests."]
            else
                Spam.setExpireOrFind(ip,604800,"banned",redis)
                return [nil,"Due to repeated spamming, you have been banned."]
        end
    end

    def self.sanitizeMessage(message)
        return "No HTML is allowed in your message." if message.strip != Sanitize.clean(message)
        return "Javascript is not allowed in your message." if !message.scan(/(?:javascript:|script:)/).empty?
    end

end
