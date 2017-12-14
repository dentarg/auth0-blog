
module Jekyll
    module MarkdownifyIncludes
      def markdownify_includes(text)
        text.gsub(/^\s*{%.+include.+\.markdown.+%}\s*$/) { |m| "{% capture my_include %}#{m}{% endcapture %}
        {{ my_include | markdownify }}" }
      end
  end
end

Liquid::Template.register_filter(Jekyll::MarkdownifyIncludes)
