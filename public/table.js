db.collection("pledges").onSnapshot(snapshot => {
  snapshot.forEach(doc => {
    console.log(doc.data());
  });
});