(() => {
  const highlightField = (field) => {
    field.classList.add("pledge-field-highlighted");
  };

  const clearFieldHighlight = (field) => {
    field.classList.remove("pledge-field-highlighted");
  };

  const fields = {
    hidden: document.querySelector("#pledge-required"),
    email: document.querySelector("#pledge-email"),
    team: document.querySelector("#pledge-team"),
    company: document.querySelector("#pledge-company"),
    name: document.querySelector("#pledge-individual"),
    count: document.querySelector("#pledge-number"),
  };

  const getValues = () => {
    const category = document.querySelector('input[name="pledge-type"]:checked')
      .value;

    const isIndividual = category === "individual";
    const isTeam = category === "team";

    return {
      category,
      hidden: fields.hidden.value,
      email: fields.email.value,
      team: isTeam ? fields.team.value : null,
      company: fields.company.value,
      name: fields.name.value,
      count: isIndividual ? 1 : Number(fields.count.value),
    };
  };

  // Hide / show content with a "[team-pledge-shown]" etc. attribute based on the
  // currently-selected category
  document.querySelectorAll('input[name="pledge-type"]').forEach((input) => {
    input.addEventListener("change", () => {
      const show = (showSelector) => {
        const hideSelector = [
          "[company-pledge-shown]",
          "[team-pledge-shown]",
          "[individual-pledge-shown]",
        ].join(", ");

        document.querySelectorAll(hideSelector).forEach((element) => {
          element.style.display = "none";
        });

        document.querySelectorAll(showSelector).forEach((element) => {
          const specialDisplay = element.getAttribute("restore-display");
          element.style.display = specialDisplay || "initial";
        });
      };

      const { category } = getValues();
      if (category === "company") {
        show("[company-pledge-shown]");
      } else if (category === "team") {
        show("[team-pledge-shown]");
      } else {
        show("[individual-pledge-shown]");
      }
    });
  });

  const form = document.querySelector("#pledge-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { category, hidden, email, team, company, name, count } = getValues();

    let isValid = true;

    if (hidden) {
      // Bots will fill this out
      isValid = false;
    }

    if (category === "team" && !team) {
      highlightField(fields.team);
      isValid = false;
    } else {
      clearFieldHighlight(fields.team);
    }

    if (!company) {
      highlightField(fields.company);
      isValid = false;
    } else {
      clearFieldHighlight(fields.company);
    }

    if (!name) {
      highlightField(fields.name);
      isValid = false;
    } else {
      clearFieldHighlight(fields.name);
    }

    if (isNaN(count) || count <= 0) {
      highlightField(fields.count);
      isValid = false;
    } else {
      clearFieldHighlight(fields.count);
    }

    if (!email || email.match(/.+@.+/) === null) {
      highlightField(fields.email);
      isValid = false;
    } else {
      clearFieldHighlight(fields.email);
    }

    if (!isValid) {
      return;
    }

    showSubmittingModal();

    try {
      const minimumDurationPromise = new Promise((resolve) => {
        // Make sure the signing interaction takes enough time to feel significant
        window.setTimeout(() => {
          resolve();
        }, 1500);
      });

      const doc = await db.collection("pledges").add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        name,
        company,
        team,
        count,
      });

      await doc.collection("privateCollection").doc("privateDocument").set({
        submitterEmail: email,
      });

      await minimumDurationPromise;

      let shareQuote;
      if (!team) {
        shareQuote = "I am off to vote.";
      } else {
        shareQuote = `${team} at ${company} is off to vote.`;
      }

      form.style.display = "none";
      document.querySelector("#pledge-form-thank-you").style.display = "block";
      document.querySelector("#submitted-quote-text").textContent = shareQuote;
      document
        .querySelector("#submitted-tweet")
        .setAttribute(
          "href",
          `https://twitter.com/intent/tweet?text=${encodeURI(
            shareQuote
          )}%20https://offtovote.org`
        );
      showSubmittedModal();
    } catch (error) {
      console.error(error);
      showSubmitErrorModal();
    }
  });
})();
