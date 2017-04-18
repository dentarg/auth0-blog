module Jekyll
  # Defines the base class of AMP posts
  class TechPost < Page
    def initialize(site, base, dir, post)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tech_index.html')
      self.data['post']=post
      self.data['title'] = post.title
      # Remove non needed keys from data
      # Excerpt will cause an error if kept
      self.data.delete('excerpt')

      self.data['canonical_url'] = post.url
    end
  end
  # Generates a new AMP post for each existing post
  class TechGenerator < Generator
    priority :low
    def generate(site)

      site.posts.each do |post|
        if post.data['is_non-tech'] == true
          dir = site.config['non-tech_dir'] || 'no-tech'
        else
          dir = site.config['tech_dir'] || 'tech'
        end
        index = AmpPost.new(site, site.source, File.join(dir, post.id), post)
        index.render(site.layouts, site.site_payload)
        index.write(site.dest)
        site.pages << index
      end
    end
  end
end
