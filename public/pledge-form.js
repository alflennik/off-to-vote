(() => {
  const form = document.querySelector('#pledge-form')
  const hiddenField = document.querySelector('#pledge-required')
  const pledgeSubmissionMessage = document.querySelector('#pledge-submission-message')
  const pledgeTypeField = document.querySelector('#pledge-type')
  const teamTypeSection = document.querySelector('#pledge-team-type')
  const pledgeTeamField = document.querySelector('#pledge-team')
  const companyNameField = document.querySelector('#pledge-company')
  const numberOfEmployeesField = document.querySelector('#pledge-number')
  const stateField = document.querySelector('#pledge-state')
  const emailField = document.querySelector('#pledge-email')
  

  const highlightField = field => {
    field.classList.add('pledge-field-highlighted')
  }
  
  const clearFieldHighlight = field => {
    field.classList.remove('pledge-field-highlighted')
  }

  pledgeTypeField.addEventListener('change', () => {
    if (pledgeTypeField.value === 'team') {
      teamTypeSection.style.display = 'initial'
    } else {
      teamTypeSection.style.display = 'none'
    }
  })

  form.addEventListener('submit', async event => {
    event.preventDefault()

    const hiddenValue = hiddenField.value
    const pledgeType = pledgeTypeField.value
    const teamName = pledgeTeamField.value
    const companyName = companyNameField.value
    const numberOfEmployees = Number(numberOfEmployeesField.value)
    const state = stateField.value
    const email = emailField.value

    let isValid = true

    if (hiddenValue) {
      isValid = false
    }

    if (pledgeType === 'team' && !teamName) {
      highlightField(pledgeTeamField)
      isValid = false
    } else {
      clearFieldHighlight(pledgeTeamField)
    }

    if (!companyName) {
      highlightField(companyNameField)
      isValid = false
    } else {
      clearFieldHighlight(companyNameField)
    }

    if (isNaN(numberOfEmployees) || numberOfEmployees <= 0) {
      highlightField(numberOfEmployeesField)
      isValid = false
    } else {
      clearFieldHighlight(numberOfEmployeesField)
    }

    if (!(state === '' || state.length === 2)) {
      highlightField(stateField)
      isValid = false
    } else {
      clearFieldHighlight(stateField)
    }

    if (!email || email.match(/.+@.+/) === null) {
      highlightField(emailField)
      isValid = false
    } else {
      clearFieldHighlight(emailField)
    }

    if (!isValid) {
      return
    }

    form.style.display = 'none'
    pledgeSubmissionMessage.style.display = 'inline-block'
    pledgeSubmissionMessage.textContent = "Submitting..."

    try {
      const doc = await db.collection('pledges').add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        companyName,
        teamName,
        numberOfEmployees: Number(numberOfEmployees),
        state,
      })

      await doc.collection('privateCollection').doc('privateDocument').set({
        submitterEmail: email,
      })

      pledgeSubmissionMessage.textContent = "Success. Thank you!"
    } catch (error) {
      console.error(error)
      pledgeSubmissionMessage.textContent = "Error"
    }
  })
})()