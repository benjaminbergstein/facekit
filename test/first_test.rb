require 'minitest/autorun'
require 'capybara/dsl'
require 'capybara/poltergeist'
require 'faraday'
require 'open3'

Capybara.default_driver = :poltergeist
Capybara.app = Rack::Builder.new do
  root = File.expand_path('../../docs', __FILE__)
  use Rack::Static, index: 'index.html', urls: ['/'], root: root
  run -> (env) { [ 200, {}, ['Not Found']] }
end

`bundle exec build`

class FirstTest < MiniTest::Test
  include Capybara::DSL
  
  def test_toggling_panel
    visit '/'
    assert_equal(true, page.has_css?('.panel', text: 'This panel is toggleable. Click on the header to toggle.'))
    find('.panel-heading', text: 'Panel').click
    assert_equal(false, page.has_css?('.panel', text: 'This panel is toggleable. Click on the header to toggle.'))
  end
  
  def within_example
    within('.is-half', text: 'Example') do
      yield
    end
  end

  def test_toggling_tabs
    visit '/'
    click_on 'Basic Tabs'

    within_example do
      assert_equal(true, page.has_css?('[data-tab-view-pane]', text: 'This is the the first tab. With any luck, it contains something very interesting.'))
      assert_equal(false, page.has_css?('[data-tab-view-pane]', text: 'This is the second tab. With not much luck, it contains even more interesting information than does tab 1.'))
    end
    
    click_on 'Tab 2'
    within_example do
      assert_equal(false, page.has_css?('[data-tab-view-pane]', text: 'This is the the first tab. With any luck, it contains something very interesting.'))
      assert_equal(true, page.has_css?('[data-tab-view-pane]', text: 'This is the second tab. With not much luck, it contains even more interesting information than does tab 1.'))
    end
  end

  def test_dismiss_message
    visit '/'
    click_on 'Dismiss'
    
    within_example do
      within '.message' do
        find('.delete').click
      end
      
      assert_equal(false, page.has_css?('[data-tab-view-pane]', text: 'Dismiss Body'))
    end
  end

  def save_screen
    f = File.open('docs/screen.html', 'wb+')
    f.write(page.html)
    f.close
    `open http://localhost:9393/screen.html`
  end
end
