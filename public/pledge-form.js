(() => {
  const form = document.querySelector('#pledge-form')
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

  form.addEventListener('submit', event => {
    event.preventDefault()

    const pledgeType = pledgeTypeField.value
    const teamName = pledgeTeamField.value
    const companyName = companyNameField.value
    const numberOfEmployees = numberOfEmployeesField.value
    const state = stateField.value
    const email = emailField.value

    let isValid = true

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

    if (numberOfEmployees === '' || numberOfEmployees === 0 || numberOfEmployees == null) {
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

    fetch('/sign-pledge', {
      method: 'POST',
      body: JSON.stringify({
        teamName,
        companyName,
        numberOfEmployees,
        state,
        submitterEmail: email,
      })
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          pledgeSubmissionMessage.textContent = "Success. Thank you!"
        } else {
          pledgeSubmissionMessage.textContent = "Error"
        }
      })
  })
})()