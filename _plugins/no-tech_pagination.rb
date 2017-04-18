module Jekyll

  class NoTechGeneratorPage < Generator
    safe true

    def generate(site)
      paginate(site)
    end

    def paginate(site)
      posts = site.posts.find_all {|post| post.data['is_non-tech'] == true}.sort_by {|post| -post.date.to_f}
      num_pages = NoTechPagerPa.calculate_pages(posts, site.config['paginate'].to_i)

      (1..num_pages).each do |page|
        pager = NoTechPagerPa.new(site, page, posts, num_pages)
        dir = File.join(site.config['non-tech_dir'] || 'no-tech', page > 1 ? "page#{page}" : '')
        page = NoTechPagePa.new(site, site.source, dir)
        page.pager = pager
        site.pages << page
      end
    end
  end

  class NoTechPagePa < Page
    def initialize(site, base, dir)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tech.html')
      self.data['switch'] = 'business'
    end
  end

  class NoTechPagerPa < Jekyll::Paginate::Pager

    def initialize(site, page, all_posts, num_pages = nil)
      super site, page, all_posts, num_pages
    end

    alias_method :original_to_liquid, :to_liquid

    def to_liquid
      liquid = original_to_liquid
      liquid
    end
  end

end
