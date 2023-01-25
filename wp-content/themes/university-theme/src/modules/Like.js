import axios from 'axios'

class Like {
  constructor() {
    if (document.querySelector('.like-box')) {
      axios.defaults.headers.common['X-WP-Nonce'] = universityData.nonce
      this.likeBox = document.querySelector('.like-box')
      this.events()
    }
  }

  events() {
    this.likeBox.addEventListener('click', this.toggleHeartClick.bind(this))
  }

  toggleHeartClick(e) {
    const curBox = e.target.closest('.like-box')

    if (this.likeBox.getAttribute('data-exists') == 'yes')
      this.removeLike(curBox)
    else this.addLike(curBox)
  }

  async addLike(element) {
    try {
      const { data } = await axios.post(
        `${universityData.rootUrl}/wp-json/university/v1/manage-like`,
        { professorId: element.getAttribute('data-professor') }
      )

      const likeCountBox = element.querySelector('.like-count')

      element.setAttribute('data-exists', 'yes')
      element.setAttribute('data-like', data)
      likeCountBox.textContent = ++likeCountBox.textContent
    } catch (err) {
      console.log(err)
    }
  }

  async removeLike(element) {
    try {
      await axios.delete(
        `${
          universityData.rootUrl
        }/wp-json/university/v1/manage-like/?like=${element.getAttribute(
          'data-like'
        )}`
      )

      const likeCountBox = element.querySelector('.like-count')

      element.setAttribute('data-exists', 'no')
      element.setAttribute('data-like', '')

      likeCountBox.textContent = --likeCountBox.textContent
    } catch (err) {
      console.log(err)
    }
  }
}

export default Like
