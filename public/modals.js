(() => {
  const anchors = document.querySelectorAll('a')
  anchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      const showModal = selector => {
        document.querySelectorAll('[modal-content]').forEach(modalContent => {
          modalContent.style.display = 'none'
        })
        
        if (selector === false) {
          document.querySelector('[modal-shade]').style.display = 'none'
        } else {
          document.querySelector('[modal-shade]').style.display = 'flex'
          document.querySelector(selector).style.display = 'block'
        }
      }
      if (anchor.attributes.href.value === '#contact') {
        event.preventDefault()
        showModal('[modal-content-contact]')
      } else if (anchor.attributes.href.value === '#close') {
        event.preventDefault()
        showModal(false)
      }
    })
  })
})()