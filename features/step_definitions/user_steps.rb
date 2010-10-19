Given /I am logged in as "(\w+)\/(\w+)"/ do |user, password|
  When 'I go to the start page'
  find(:xpath, "//div[@id='facebox']//input[@id='register_user']").set user
  find(:xpath, "//div[@id='facebox']//input[@id='register_password']").set password
  find(:xpath, "//div[@id='facebox']//input[@value='Register']").click
end

When /I log in as "(\w+)\/(\w+)"/ do |user, password|
  When 'I go to the start page'
  patiently do
    find(:xpath, "//div[@id='facebox']//input[@id='login_user']").set user
    find(:xpath, "//div[@id='facebox']//input[@id='login_password']").set password
    find(:xpath, "//div[@id='facebox']//input[@value='Login']").click
  end
end

Given /a user "(\w+)\/(\w+)"/ do |user, password|
  create_user(user, password)
end

Given /a user "(\w+)"/ do |user|
  create_user(user, 'Test')
end

def create_user(user, password)
  When 'I go to the start page'
  page.execute_script("$.ajax({ url: '/users', type: 'POST', data: { name: '#{user}', password: '#{password}' } })")
end