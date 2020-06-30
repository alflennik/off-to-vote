let showSubmittingModal
let showSubmitErrorModal
let showSubmittedModal
(() => {
  const showModal = selector => {
    document.querySelectorAll('[modal]').forEach(modalContent => {
      modalContent.style.display = 'none'
    })
    
    if (selector === false) {
      document.querySelector('[modal-shade]').style.display = 'none'
    } else {
      document.querySelector('[modal-shade]').style.display = 'flex'
      document.querySelector(selector).style.display = 'block'
    }
  }

  showSubmittingModal = () => showModal('[modal-submitting]')
  showSubmitErrorModal = () => showModal('[modal-submit-error]')
  showSubmittedModal = () => showModal('[modal-submitted]')

  const anchors = document.querySelectorAll('a')
  anchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      if (anchor.attributes.href.value === '#contact') {
        event.preventDefault()
        showModal('[modal-contact]')
      } else if (anchor.attributes.href.value === '#close') {
        event.preventDefault()
        showModal(false)
      }
    })
  })
})()