(() => {
  const escapeHtml = (string) => {
    var p = document.createElement("p");
    p.appendChild(document.createTextNode(string));
    return p.innerHTML;
  };

  const tableBody = document.querySelector("#table-body");
  const progressNumber = document.querySelector("#progress-number");

  db.collection("pledges")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      let newTableBody = "";
      let totalCount = 0;

      snapshot.forEach((doc) => {
        const { category, count, name, company, team } = doc.data();
        newTableBody += `
        <tr>
          <td>${escapeHtml(category)}</td>
          <td>${escapeHtml(count)}</td>
          <td>${escapeHtml(name)}</td>
          <td>${escapeHtml(company)}</td>
          <td>${escapeHtml(team || "")}</td>
        </tr>
      `;

        totalCount += count;
      });

      progressNumber.textContent = new Intl.NumberFormat("en-US").format(
        totalCount
      );

      if (newTableBody.length) {
        tableBody.innerHTML = newTableBody;
      }
    });
})();
