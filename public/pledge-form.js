(() => {
  const form = document.querySelector('#pledge-form')
  const hiddenField = document.querySelector('#pledge-required')
  const pledgeSubmissionMessage = document.querySelector('#pledge-submission-message')
  const pledgeTypeField = document.querySelector('#pledge-type')
  const pledgeTeamField = document.querySelector('#pledge-team')
  const companyNameField = document.querySelector('#pledge-company')
  const individualNameField = document.querySelector('#pledge-individual')
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
    const show = (showSelector) => {
      const hideSelector = '[company-pledge-shown], [team-pledge-shown], [individual-pledge-shown]'
      document.querySelectorAll(hideSelector).forEach(element => {
        element.style.display = 'none'
      })
      document.querySelectorAll(showSelector).forEach(element => {
        element.style.display = 'initial'
      })
    }

    if (pledgeTypeField.value === 'company') {
      show('[company-pledge-shown]')
    } else if (pledgeTypeField.value === 'team') {
      show('[team-pledge-shown]')
    } else {
      show('[individual-pledge-shown]')
    }
  })

  form.addEventListener('submit', async event => {
    event.preventDefault()

    const pledgeType = pledgeTypeField.value
    const isIndividualPledge = pledgeType === 'individual'
    const isTeamPledge = pledgeType === 'team'

    const hiddenValue = hiddenField.value
    const teamName = isTeamPledge ? pledgeTeamField.value : null
    const companyName = isIndividualPledge ? null : companyNameField.value
    const individualName = isIndividualPledge ? individualNameField.value : null
    const numberOfEmployees = isIndividualPledge ? 1 : Number(numberOfEmployeesField.value)
    const state = stateField.value
    const email = emailField.value

    let isValid = true

    if (hiddenValue) {
      // Bots will fill this out
      isValid = false
    }

    if (pledgeType === 'team' && !teamName) {
      highlightField(pledgeTeamField)
      isValid = false
    } else {
      clearFieldHighlight(pledgeTeamField)
    }

    if (!isIndividualPledge && !companyName) {
      highlightField(companyNameField)
      isValid = false
    } else {
      clearFieldHighlight(companyNameField)
    }

    if (isIndividualPledge && !individualName) {
      highlightField(individualNameField)
      isValid = false
    } else {
      clearFieldHighlight(individualNameField)
    }

    if (isNaN(numberOfEmployees) || numberOfEmployees <= 0) {
      highlightField(numberOfEmployeesField)
      isValid = false
    } else {
      clearFieldHighlight(numberOfEmployeesField)
    }

    if (!((state === '' && !isIndividualPledge) || state.length === 2)) {
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
    showSubmittingModal()

    try {
      const minimumDurationPromise = new Promise(resolve => {
        // Make sure the signing interaction takes enough time to feel significant
        window.setTimeout(() => {
          resolve()
        }, 1500)
      })

      const doc = await db.collection('pledges').add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        companyName,
        teamName,
        individualName,
        numberOfEmployees,
        state,
      })

      await doc.collection('privateCollection').doc('privateDocument').set({
        submitterEmail: email,
      })

      throw new Error()

      await minimumDurationPromise

      showSubmittedModal()
    } catch (error) {
      console.error(error)
      showSubmitErrorModal()
    }
  })
})()