# v2026: exposes simple publication statistics as site.data["bib_stats"]
# (used by the home page "at a glance" strip).
module Jekyll
  class BibStatsGenerator < Generator
    safe true
    priority :high

    def generate(site)
      cfg = site.config["scholar"] || {}
      dir = (cfg["source"] || "_bibliography").sub(%r{^/}, "")
      file = File.join(site.source, dir, cfg["bibliography"] || "papers.bib")
      return unless File.exist?(file)

      text = File.read(file, encoding: "utf-8")
      entries = text.scan(/^\s*@(\w+)\s*\{/).flatten.reject { |t| %w[string comment preamble].include?(t.downcase) }
      years = text.scan(/^\s*year\s*=\s*[{"]?(\d{4})/i).flatten.map(&:to_i)
      site.data["bib_stats"] = {
        "total" => entries.size,
        "first_year" => years.min,
        "last_year" => years.max
      }
    end
  end
end
