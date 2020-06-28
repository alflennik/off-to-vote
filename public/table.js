(() => {
  // const tableBody = document.querySelector('#table-body')

  db.collection("pledges").onSnapshot(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.data())
      // const { companyName, teamName, numberOfEmployees}

      // const tr = document.createElement('tr')

      // tr.innerHTML = `
      //   <td>
      //     {}
      // `
    })
  })
})()
