require 'rubygems'
require 'json'
require 'capybara/cucumber'
require 'test/unit'
require 'test/unit/assertions'
include Test::Unit::Assertions
require 'httparty'

Capybara.app = nil
Capybara.app_host = 'http://127.0.0.1:3000'
Capybara.default_driver = :selenium
Capybara.register_driver :selenium do |app|
  Capybara::Driver::Selenium.new(app, :browser => :chrome)
end
    
Symbol.class_eval do
  def to_proc
    Proc.new{|object| object.send(self)}
  end
end unless :symbol.respond_to?(:to_proc)

def patiently(&block)
  cycles = 0
  begin
    yield
  rescue  => e
    cycles += 1
    sleep 0.1
    if cycles < 10
      retry 
    else
      raise e
    end
  end
end