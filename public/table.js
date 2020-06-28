(() => {
  const escapeHtml = string => {
    var p = document.createElement('p')
    p.appendChild(document.createTextNode(string))
    return p.innerHTML
  }

  const tableBody = document.querySelector('#table-body')
  const progressNumber = document.querySelector('#progress-number')

  db.collection("pledges").orderBy("createdAt", "desc").onSnapshot(snapshot => {
    let newTableBody = ""
    let totalEmployees = 0

    snapshot.forEach(doc => {
      const { companyName, teamName, individualName, numberOfEmployees, state } = doc.data()

      let signed
      if (teamName) {
        signed = `${teamName} at ${companyName}`
      } else if (companyName) {
        signed = companyName
      } else {
        signed = individualName
      }

      newTableBody += `
        <tr>
          <td>${escapeHtml(signed)}</td>
          <td>${escapeHtml(numberOfEmployees)}</td>
          <td>${escapeHtml(state)}</td>
        </tr>
      `

      totalEmployees += numberOfEmployees
    })

    progressNumber.textContent = new Intl.NumberFormat('en-US').format(totalEmployees)

    if (newTableBody.length) {
      tableBody.innerHTML = newTableBody
    }
  })
})()
