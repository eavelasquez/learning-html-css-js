/**
 * A lightweight youtube embed.
 */
class LiteYTEmbed extends window.HTMLElement {
  async connectedCallback () {
    this.videoId = this.getAttribute('videoid')

    let playBtnEl = this.querySelector('.lty-playbtn')
    // A label for the button takes priority over a [playlabel] attribute on the custom-element
    this.playLabel =
      (playBtnEl && playBtnEl.textContent.trim()) ||
      this.getAttribute('playlabel') ||
      'Play'

    const isWebpSupported = await LiteYTEmbed.checkWebPSupport()

    this.posterUrl = isWebpSupported
      ? `https://i.ytimg.com/vi_webp/${this.videoId}/hqdefault.webp`
      : `https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg`

    // Warm the connection for the poster image
    LiteYTEmbed.addPrefetch('preload', this.posterUrl, 'image')

    this.style.backgroundImage = `url("${this.posterUrl}")`

    // Set up play button, and its visually hidden label
    if (!playBtnEl) {
      playBtnEl = document.createElement('button')
      playBtnEl.type = 'button'
      playBtnEl.classList.add('lty-playbtn')
      this.append(playBtnEl)
    }
    if (!playBtnEl.textContent) {
      const playBtnLabelEl = document.createElement('span')
      playBtnLabelEl.className = 'lyt-visually-hidden'
      playBtnLabelEl.textContent = this.playLabel
      playBtnEl.append(playBtnLabelEl)
    }

    // On hover (or tap), warm up the TCP connections we're (likely) about to use.
    this.addEventListener('pointerover', LiteYTEmbed.warmConnections, {
      once: true
    })

    // Once the user clicks, add the real iframe and drop our play button
    // TODO: In the future we could be like amp-youtube and silently swap in the iframe during idle time
    //   We'd want to only do this for in-viewport or near-viewport ones: https://github.com/ampproject/amphtml/pull/5003
    this.addEventListener('click', (e) => this.addIframe())
  }

  static addPrefetch (kind, url, as) {
    const linkEl = document.createElement('link')
    linkEl.rel = kind
    linkEl.href = url
    if (as) {
      linkEl.as = as
    }
    document.head.append(linkEl)
  }

  /**
   * Check WebP support for the user
   */
  static checkWebPSupport () {
    if (typeof LiteYTEmbed.hasWebPSupport !== 'undefined') {
      return Promise.resolve(LiteYTEmbed.hasWebPSupport)
    }

    return new Promise((resolve) => {
      const resolveAndSaveValue = (value) => {
        LiteYTEmbed.hasWebPSupport = value
        resolve(value)
      }

      const img = new window.Image()
      img.onload = () => resolveAndSaveValue(true)
      img.onerror = () => resolveAndSaveValue(false)
      img.src =
        'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
    })
  }

  /**
   * Begin pre-connecting to warm up the iframe load
   * Since the embed's network requests load within its iframe,
   *   preload/prefetch'ing them outside the iframe will only cause double-downloads.
   * So, the best we can do is warm up a few connections to origins that are in the critical path.
   *
   * Maybe `<link rel=preload as=document>` would work, but it's unsupported: http://crbug.com/593267
   * But TBH, I don't think it'll happen soon with Site Isolation and split caches adding serious complexity.
   */
  static warmConnections () {
    if (LiteYTEmbed.preconnected) return

    // The iframe document and most of its subresources come right off youtube.com
    LiteYTEmbed.addPrefetch('preconnect', 'https://www.youtube-nocookie.com')
    // The botguard script is fetched off from google.com
    LiteYTEmbed.addPrefetch('preconnect', 'https://www.google.com')

    // Not certain if these ad related domains are in the critical path. Could verify with domain-specific throttling.
    LiteYTEmbed.addPrefetch('preconnect', 'https://googleads.g.doubleclick.net')
    LiteYTEmbed.addPrefetch('preconnect', 'https://static.doubleclick.net')

    LiteYTEmbed.preconnected = true
  }

  addIframe () {
    const params = new URLSearchParams(this.getAttribute('params') || [])
    params.append('autoplay', '1')

    const iframeEl = document.createElement('iframe')
    iframeEl.width = 560
    iframeEl.height = 315
    // No encoding necessary as [title] is safe. https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#:~:text=Safe%20HTML%20Attributes%20include
    iframeEl.title = this.playLabel
    iframeEl.allow =
      'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
    iframeEl.allowFullscreen = true
    // AFAIK, the encoding here isn't necessary for XSS, but we'll do it only because this is a URL
    // https://stackoverflow.com/q/64959723/89484
    iframeEl.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
      this.videoId
    )}?${params.toString()}`
    this.append(iframeEl)

    this.classList.add('lyt-activated')

    // Set focus for a11y
    this.querySelector('iframe').focus()
  }
}

// Register custome element
window.customElements.define('lite-youtube', LiteYTEmbed)
