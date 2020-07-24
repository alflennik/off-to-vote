(() => {
  const highlightField = (field) => {
    field.classList.add("pledge-field-highlighted");
  };

  const clearFieldHighlight = (field) => {
    field.classList.remove("pledge-field-highlighted");
  };

  const fields = {
    hidden: document.querySelector("#form-required"),
    email: document.querySelector("#form-email"),
    team: document.querySelector("#form-team"),
    company: document.querySelector("#form-company"),
    name: document.querySelector("#form-name"),
    count: document.querySelector("#form-count"),
  };

  const getValues = () => {
    const category = document.querySelector('input[name="category"]:checked')
      .value;

    const isIndividual = category === "Individual";
    const isTeam = category === "Team";

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
  document.querySelectorAll('input[name="category"]').forEach((input) => {
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
      } else if (category === "Team") {
        show("[team-pledge-shown]");
      } else {
        show("[individual-pledge-shown]");
      }
    });
  });

  // Analytics tracking

  Object.values(fields).forEach((field) => {
    field.addEventListener("focus", () => {
      trackFocusEvent();
    });
  });

  Object.values(fields).forEach((field) => {
    field.addEventListener("input", () => {
      trackTypeEvent();
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

    if (category === "Team" && !team) {
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
        category,
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
      if (category === "Individual") {
        shareQuote =
          "I will be off on Election Day. What about you? Sign the pledge: " +
          "https://offtovote.org";
      } else {
        shareQuote =
          "I’m making sure my team has time off to vote on Election Day. How about you? " +
          "Sign the pledge: https://offtovote.org";
      }

      form.style.display = "none";
      document.querySelector("#pledge-form-thank-you").style.display = "block";
      const tweetLink = document.querySelector("#submitted-tweet");
      tweetLink.setAttribute(
        "href",
        `https://twitter.com/intent/tweet?text=${encodeURI(shareQuote)}`
      );
      tweetLink.addEventListener("click", (event) => {
        trackShareEvent();
      });

      showSubmittedModal();
      trackSubmitEvent();
    } catch (error) {
      console.error(error);
      showSubmitErrorModal();
      trackSubmitErrorEvent();
    }
  });
})();
