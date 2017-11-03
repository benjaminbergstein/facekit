def example
  html = yield(:example)
  escaped_html = yield(:code).gsub('<', '&lt;').gsub('>', '&gt;')
  whitespace = escaped_html.match(/\A\s+/).to_a.first
  escaped_html.gsub!("#{whitespace}", "\n")
  
  example_html = tag '.column.is-half' do
    [
      tag(:div) { tag 'span.tag.is-primary', 'Example', style: 'position: relative; top: 3px; left: 8px' },
      tag('.box', tag(:div, html))
    ]
  end

  code_html = tag '.column.is-half' do
    [
      tag(:div) { tag 'span.tag', 'Code', style: 'position: relative; top: 3px; left: 8px' },
      tag(:div) {
        tag('pre.is-marginless') do
          tag('code.html.is-paddingless.is-marginless') { escaped_html.gsub('=""', '') }
        end
      }
    ]
  end
  
  tag('.columns'){[example_html, code_html]}
end

def tag(representation, content = nil, **additional_attributes)
  matches = representation.to_s.match(/([^#^.]+)?(#[^\.]+)?(\..+)?/)
  tag = matches[1] || 'div'
  id = matches[2]
  classes_string = matches[3]
  classes = classes_string.nil? ? [] : classes_string[1..-1].split('.')
  inner_html =
    if block_given?
      content = yield
      content.is_a?(Array) ? content.join('') : content
    else
      content
    end
  attributes = additional_attributes.each_with_object('') do |(key, val), attributes|
    attributes << " #{key}=\"#{val}\""
  end
  
  "<#{tag}#{" id='#{id}'" if id}#{" class='#{classes.join(' ')}'" if classes.any?}#{attributes}>#{inner_html}</#{tag}>"
end
