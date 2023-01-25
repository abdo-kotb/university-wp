class Search {
  constructor() {
    this.addSearchOverlay()
    this.openButton = document.querySelectorAll('.js-search-trigger')
    this.closeButton = document.querySelector('.search-overlay__close')
    this.searchOverlay = document.querySelector('.search-overlay')
    this.searchField = document.getElementById('search-term')
    this.resultsDiv = document.getElementById('search-overlay__results')
    this.events()

    this.isOverlayOpen = false
    this.isLoading = false
    this.typingTimer
    this.previousSearchValue
  }

  events() {
    this.openButton.forEach(btn =>
      btn.addEventListener('click', this.openOverlay.bind(this))
    )
    this.closeButton.addEventListener('click', this.closeOverlay.bind(this))

    document.addEventListener('keydown', this.keyPressDispatcher.bind(this))

    this.searchField.addEventListener('keyup', this.onTyping.bind(this))
  }

  onTyping(e) {
    console.log(this.previousSearchValue, e.target.value)
    if (this.previousSearchValue !== e.target.value) {
      clearTimeout(this.typingTimer)

      if (e.target.value.trim()) {
        if (!this.isLoading) {
          this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>'
          this.isLoading = true
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 300)
      } else {
        this.resultsDiv.innerHTML = ''
        this.isLoading = false
      }
    }
    this.previousSearchValue = e.target.value
  }

  async getResults() {
    const data = await (
      await fetch(
        `${universityData.rootUrl}/wp-json/university/v1/search?term=${this.searchField.value}`
      )
    ).json()

    const html = `
      <div class="row">
        <div class="one-third">
          <h2 class="search-overlay__section-title">General Information</h2>
          ${
            data.generalInfo.length
              ? `
                  <ul class="link-list min-list">
                    ${data.generalInfo.map(
                      item =>
                        `
                          <li>
                            <a href="${item.url}">${item.title}</a>
                            ${
                              item.postType == 'post'
                                ? ` by ${item.authorName}`
                                : ''
                            }
                          </li>
                        `
                    )}
                  </ul>
                `
              : `
                <p>No general information matches this results</p>
              `
          }
        </div>
        <div class="one-third">
          <h2 class="search-overlay__section-title">Programs</h2>
          ${
            data.programs.length
              ? `
                  <ul class="link-list min-list">
                    ${data.programs.map(
                      item =>
                        `<li>
                          <a href="${item.url}">${item.title}</a>
                        </li>`
                    )}
                  </ul>
                `
              : `
              <p>No programs matches this results.
                <a href="${universityData.rootUrl}/programs">View all programs</a>
              </p>
            `
          }
          <h2 class="search-overlay__section-title">Professors</h2>
          ${
            data.professors.length
              ? `
                <ul class="professor-cards">
                  ${data.professors.map(
                    item =>
                      `
                        <li class="professor-card__list-item">
                          <a class="professor-card" href="${item.url}">
                            <img class="professor-card__image" src="${item.image}" />
                            <span class="professor-card__name">${item.title}</span>
                          </a>
                        </li>
                      `
                  )}
                </ul>
              `
              : '<p>No professors matches this results.</p>'
          }
        </div>
        <div class="one-third">
          <h2 class="search-overlay__section-title">Events</h2>
          ${
            data.events.length
              ? `
                  ${data.events.map(
                    item =>
                      `
                        <div class="event-summary">
                          <a class="event-summary__date t-center" href="${item.url}">
                            <span class="event-summary__month">
                              ${item.month}
                            </span>
                            <span class="event-summary__day">
                              ${item.day}
                            </span>
                          </a>
                          <div class="event-summary__content">
                            <h5 class="event-summary__title headline headline--tiny">
                              <a href="${item.url}">${item.title}</a>
                            </h5>
                            <p>
                              ${item.description}
                              <a href="${item.url}" class="nu gray">Learn more</a>
                            </p>
                          </div>
                        </div>
                      `
                  )}
                `
              : `
                  <p>No events matches this results. 
                    <a href="${universityData.rootUrl}/events">View all events</a>
                  </p>
                `
          }
          </div>
        </div>
      `

    this.resultsDiv.innerHTML = html
    this.isLoading = false
  }

  openOverlay(e) {
    e?.preventDefault()
    this.searchOverlay.classList.add('search-overlay--active')
    document.body.classList.add('body-no-scroll')
    this.searchField.value = ''
    setTimeout(() => this.searchField.focus(), 301)
    this.isOverlayOpen = true
  }

  closeOverlay() {
    this.searchOverlay.classList.remove('search-overlay--active')
    document.body.classList.remove('body-no-scroll')
    this.isOverlayOpen = false
  }

  keyPressDispatcher(e) {
    if (
      (document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA') &&
      document.activeElement !== this.searchField
    )
      return

    if (e.keyCode === 83 && !this.isOverlayOpen) this.openOverlay()
    if (e.keyCode === 27 && this.isOverlayOpen) this.closeOverlay()
  }

  addSearchOverlay() {
    document.body.insertAdjacentHTML(
      'beforeend',
      `
    <div class="search-overlay">
      <div class="search-overlay__top">
        <div class="container">
          <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
          <input type="text" class="search-term" placeholder="type your search" id="search-term" />
          <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
        </div>
      </div>

      <div class="container">
        <div id="search-overlay__results"></div>
      </div>
    </div>
    `
    )
  }
}

export default Search
