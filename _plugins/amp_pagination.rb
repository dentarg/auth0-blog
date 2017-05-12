module Jekyll

  class AmpGeneratorPage < Generator
    safe true

    def generate(site)
      paginate(site)
    end

    def paginate(site)
      amp_posts = site.posts.find_all {|post| post.data['is_extend'] != true}.sort_by {|post| -post.date.to_f}
      num_pages = AmpPagerPa.calculate_pages(amp_posts, site.config['paginate'].to_i)

      (1..num_pages).each do |page|
        pager = AmpPagerPa.new(site, page, amp_posts, num_pages)
        dir = File.join('amp', page > 1 ? "page#{page}" : '')
        page = AmpPagePa.new(site, site.source, dir)
        page.pager = pager
        site.pages << page
      end
    end
  end

  class AmpPagePa < Page
    def initialize(site, base, dir)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'amp_list_post.html')
    end
  end

  class AmpPagerPa < Jekyll::Paginate::Pager

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
