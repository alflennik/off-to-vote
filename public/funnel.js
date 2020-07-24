let trackFocusEvent;
let trackTypeEvent;
let trackSubmitEvent;
let trackSubmitErrorEvent;
let trackShareEvent;
(() => {
  let hasSentFocusEvent = false;
  trackFocusEvent = () => {
    if (hasSentFocusEvent) {
      return;
    }
    hasSentFocusEvent = true;
    gtag("event", "Focused Form Input");
  };

  let hasSentTrackTypeEvent = false;
  trackTypeEvent = () => {
    if (hasSentTrackTypeEvent) {
      return;
    }
    hasSentTrackTypeEvent = true;
    gtag("event", "Typed Into Form Input");
  };

  trackSubmitEvent = () => {
    gtag("event", "Submitted Form");
  };

  trackSubmitErrorEvent = () => {
    gtag("event", "Submitted Form ERROR");
  };

  trackShareEvent = () => {
    gtag("event", "Clicked Tweet");
  };
})();
