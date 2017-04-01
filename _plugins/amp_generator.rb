module Jekyll
  # Defines the base class of AMP posts
  class AmpPost < Page
    def initialize(site, base, dir, post)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'amp_index.html')
      self.data['post']=post
      archive_title_prefix = site.config['archive_title_prefix'] || 'Archive: &ldquo;'
      archive_title_suffix = site.config['archive_title_suffix'] || '&rdquo;'
      self.data['title'] = post.title
      # Remove non needed keys from data
      # Excerpt will cause an error if kept
      self.data.delete('excerpt')

      self.data['canonical_url'] = post.url
    end
  end
  # Generates a new AMP post for each existing post
  class AmpGenerator < Generator
    priority :low
    def generate(site)
      dir = site.config['ampdir'] || 'amp'
      site.posts.each do |post|
        next if post.data['skip_amp'] == true
        index = AmpPost.new(site, site.source, File.join(dir, post.id), post)
        index.render(site.layouts, site.site_payload)
        index.write(site.dest)
        site.pages << index
      end
    end
  end
end
