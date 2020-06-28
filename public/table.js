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
      const { companyName, teamName, numberOfEmployees, state } = doc.data()

      newTableBody += `
        <tr>
          <td>${escapeHtml(companyName)}</td>
          <td>${escapeHtml(teamName)}</td>
          <td>${escapeHtml(numberOfEmployees)}</td>
          <td>${escapeHtml(state)}</td>
        </tr>
      `

      totalEmployees += numberOfEmployees
    })

    progressNumber.textContent = new Intl.NumberFormat('en-US').format(totalEmployees)

    tableBody.innerHTML = `
      <tr>
        <td><a href="#pledge">Add your company</a></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      ${newTableBody}
    `
  })
})()
