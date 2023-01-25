import axios from 'axios'

class MyNotes {
  constructor() {
    if (document.querySelector('#my-notes')) {
      axios.defaults.headers.common['X-WP-Nonce'] = universityData.nonce
      this.myNotes = document.querySelector('#my-notes')
      this.events()
    }
  }

  events() {
    this.myNotes.addEventListener('click', e => this.clickHandler(e))
    document
      .querySelector('.submit-note')
      .addEventListener('click', this.createNote.bind(this))
  }

  clickHandler(e) {
    if (
      e.target.classList.contains('delete-note') ||
      e.target.classList.contains('fa-trash-o')
    )
      this.deleteNote(e)
    if (
      e.target.classList.contains('edit-note') ||
      e.target.classList.contains('fa-pencil') ||
      e.target.classList.contains('fa-times')
    )
      this.editNote(e)
    if (
      e.target.classList.contains('update-note') ||
      e.target.classList.contains('fa-arrow-right')
    )
      this.updateNote(e)
  }

  findNearestParentLi(el) {
    let thisNote = el
    while (thisNote.tagName != 'LI') {
      thisNote = thisNote.parentElement
    }
    return thisNote
  }

  async deleteNote(e) {
    const thisNote = this.findNearestParentLi(e.target)

    try {
      const { data } = await axios.delete(
        `${universityData.rootUrl}/wp-json/wp/v2/note/${thisNote.getAttribute(
          'data-id'
        )}`
      )
      thisNote.style.height = `${thisNote.offsetHeight}px`
      setTimeout(function () {
        thisNote.classList.add('fade-out')
      }, 20)
      setTimeout(function () {
        thisNote.remove()
      }, 401)

      if (data.userNoteCount)
        document.querySelector('.note-limit-message').classList.remove('active')
    } catch (err) {
      console.log(err)
    }
  }

  async createNote(e) {
    const titleField = document.querySelector('.new-note-title')
    const bodyField = document.querySelector('.new-note-body')
    const newPost = {
      title: titleField.value,
      content: bodyField.value,
      status: 'publish',
    }

    try {
      const { data } = await axios.post(
        `${universityData.rootUrl}/wp-json/wp/v2/note`,
        newPost
      )

      if (response.data == 'You have reached your note limit.') {
        document.querySelector('.note-limit-message').classList.add('active')
        return
      }
      titleField.value = ''
      bodyField.value = ''

      const html = `
        <li data-id="${data.id}" class="fade-in-calc">
          <input readonly class="note-title-field" value="${data.title.raw}" />
          <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
          <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
          <textarea readonly class="note-body-field">${data.content.raw}</textarea>
          <span class="update-note btn btn--blue btn--small">
            <i class="fa fa-arrow-right" aria-hidden="true"></i> Save
          </span>
        </li>
      `

      this.myNotes.insertAdjacentHTML('afterbegin', html)

      let finalHeight // browser needs a specific height to transition to, you can't transition to 'auto' height
      let newlyCreated = document.querySelector('#my-notes li')

      setTimeout(function () {
        finalHeight = `${newlyCreated.offsetHeight}px`
        newlyCreated.style.height = '0px'
      }, 30)

      setTimeout(function () {
        newlyCreated.classList.remove('fade-in-calc')
        newlyCreated.style.height = finalHeight
      }, 50)

      setTimeout(function () {
        newlyCreated.style.removeProperty('height')
      }, 450)
      newlyCreated.scrollIntoView({ behavior: 'smooth' })
    } catch (err) {
      console.log(err)
    }
  }

  async updateNote(e) {
    const thisNote = this.findNearestParentLi(e.target)
    const updatedPost = {
      title: thisNote.querySelector('.note-title-field').value,
      content: thisNote.querySelector('.note-body-field').value,
    }

    try {
      await axios.post(
        `${universityData.rootUrl}/wp-json/wp/v2/note/${thisNote.getAttribute(
          'data-id'
        )}`,
        updatedPost
      )
      this.makeNoteReadonly(thisNote)
    } catch (err) {
      console.log(err)
    }
  }

  makeNoteEditable(thisNote) {
    thisNote.setAttribute('data-state', 'editable')

    const titleField = thisNote.querySelector('.note-title-field')
    const bodyField = thisNote.querySelector('.note-body-field')
    const saveBtn = thisNote.querySelector('.update-note')
    const editBtn = thisNote.querySelector('.edit-note')

    editBtn.innerHTML = `
    <i class="fa fa-times" aria-hidden="true"></i>
    Cancel
    `
    titleField.removeAttribute('readonly')
    bodyField.removeAttribute('readonly')
    titleField.classList.add('note-active-field')
    bodyField.classList.add('note-active-field')
    saveBtn.classList.add('update-note--visible')
  }
  makeNoteReadonly(thisNote) {
    thisNote.setAttribute('data-state', 'readonly')

    const titleField = thisNote.querySelector('.note-title-field')
    const bodyField = thisNote.querySelector('.note-body-field')
    const saveBtn = thisNote.querySelector('.update-note')
    const editBtn = thisNote.querySelector('.edit-note')

    editBtn.innerHTML = `
    <i class="fa fa-pencil" aria-hidden="true"></i>
    Edit
    `
    titleField.setAttribute('readonly', 'true')
    bodyField.setAttribute('readonly', 'true')
    titleField.classList.remove('note-active-field')
    bodyField.classList.remove('note-active-field')
    saveBtn.classList.remove('update-note--visible')
  }

  async editNote(e) {
    const thisNote = this.findNearestParentLi(e.target)

    if (thisNote.getAttribute('data-state') == 'editable') {
      this.makeNoteReadonly(thisNote)
    } else {
      this.makeNoteEditable(thisNote)
    }
  }
}

export default MyNotes
