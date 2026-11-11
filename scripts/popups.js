// Pop-up-Ticket: Abstimmung mit Warteliste und Spot-Vorschlag von Veranstaltern.
// Ohne JS senden beide Formulare direkt an Web3Forms.
(() => {
  if (!window.fetch || !window.FormData || !window.AbortController) return;
  const byId = id => document.getElementById(id);

  // Gemeinsame Logik: Eingaben prüfen, ohne Seitenwechsel senden, Bestätigung zeigen.
  const wireForm = ({ form, fields, messageFor, prepare, status, submit, success, onSuccess, texts }) => {
    const originalSubmit = submit.innerHTML;
    let pending = false;
    let attempted = false;

    const setError = (field, message) => {
      const id = `${field.id}Error`;
      let error = byId(id);
      if (message && !error) {
        error = document.createElement('span');
        error.id = id;
        error.className = 'popups-vote-error';
        (field.type === 'checkbox' ? field.closest('label') : field).insertAdjacentElement('afterend', error);
        field.setAttribute('aria-describedby', id);
      }
      if (error) {
        error.textContent = message;
        error.hidden = !message;
      }
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    };

    const setStatus = (message, state = '') => {
      status.textContent = message;
      status.dataset.state = state;
    };

    fields.forEach(field => {
      const eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventName, () => {
        if (attempted || field.hasAttribute('aria-invalid')) setError(field, messageFor(field));
      });
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (pending) return;
      attempted = true;
      fields.forEach(field => {
        if (['text', 'email'].includes(field.type)) field.value = field.value.trim();
      });

      const invalid = fields.filter(field => {
        const message = messageFor(field);
        setError(field, message);
        return Boolean(message);
      });
      if (invalid.length) {
        setStatus('Bitte prüfe die markierten Angaben.', 'error');
        invalid[0].focus();
        return;
      }

      const honeypot = form.querySelector('[name="botcheck"]');
      if (honeypot?.checked) return;

      const data = new FormData(form);
      prepare(data);

      const controls = Array.from(form.querySelectorAll('input, select, button'));
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 20000);
      pending = true;
      form.setAttribute('aria-busy', 'true');
      controls.forEach(control => { control.disabled = true; });
      submit.textContent = 'Wird gesendet …';
      setStatus(texts.sending, 'sending');
      let focusTarget = status;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          signal: controller.signal,
          headers: { Accept: 'application/json' }
        });
        const result = await response.json();
        if (response.ok && result.success === true) {
          onSuccess();
          form.hidden = true;
          success.hidden = false;
          setStatus('');
          focusTarget = success;
        } else {
          setStatus(texts.failed, 'error');
        }
      } catch (_error) {
        setStatus('Der Versand konnte nicht bestätigt werden. Bitte versuche es später noch einmal.', 'error');
      } finally {
        window.clearTimeout(timeout);
        controls.forEach(control => { control.disabled = false; });
        submit.innerHTML = originalSubmit;
        form.removeAttribute('aria-busy');
        pending = false;
        focusTarget.focus();
      }
    });

    form.noValidate = true;
  };

  const emailMessage = (field, missing) => {
    if (!field.value.trim()) return missing;
    if (field.validity.typeMismatch) return 'Bitte gib eine gültige E-Mail-Adresse an, zum Beispiel name@beispiel.de.';
    return '';
  };

  // 1) Pop-up wünschen: Stimme für einen Ort plus Warteliste.
  const voteForm = byId('popupVoteForm');
  const vote = {
    place: byId('popupVotePlace'), email: byId('popupVoteEmail'), consent: byId('popupVoteConsent'),
    submit: byId('popupVoteSubmit'), status: byId('popupVoteStatus'),
    success: byId('popupVoteSuccess'), successPlace: byId('popupVoteSuccessPlace')
  };
  if (voteForm && Object.values(vote).every(Boolean)) {
    const times = Array.from(voteForm.querySelectorAll('.popups-vote-times input[type="checkbox"]'));
    wireForm({
      form: voteForm,
      fields: [vote.place, vote.email, vote.consent],
      status: vote.status,
      submit: vote.submit,
      success: vote.success,
      messageFor: field => {
        if (field === vote.place && !field.value.trim()) return 'Bitte gib eine Postleitzahl oder einen Ort an.';
        if (field === vote.email) return emailMessage(field, 'Bitte gib deine E-Mail-Adresse an, damit wir dir Bescheid geben können.');
        if (field === vote.consent && !field.checked) return 'Bitte bestätige, dass wir dir das erste Pop-up per E-Mail ankündigen dürfen.';
        return '';
      },
      // Zeitwünsche als ein Feld senden, Betreff mit Ort erleichtert das Zählen im Postfach.
      prepare: data => {
        const chosenTimes = times.filter(input => input.checked)
          .map(input => input.dataset.label || input.closest('label').textContent.trim());
        times.forEach(input => data.delete(input.name));
        data.set('Wann', chosenTimes.length ? chosenTimes.join(', ') : 'keine Angabe');
        data.set('subject', `Pop-up-Stimme: ${vote.place.value}`);
      },
      onSuccess: () => {
        vote.successPlace.textContent = vote.place.value;
        const alternative = byId('popupVoteAlt');
        if (alternative) alternative.hidden = true;
      },
      texts: {
        sending: 'Deine Stimme wird gesendet …',
        failed: 'Deine Stimme konnte nicht gesendet werden. Deine Angaben bleiben erhalten, bitte versuche es gleich noch einmal.'
      }
    });
  }

  // 2) Spot anbieten: Vorschlag von Veranstaltern und Flächenbesitzern.
  const spotForm = byId('popupSpotForm');
  const spot = {
    type: byId('popupSpotType'), place: byId('popupSpotPlace'), contact: byId('popupSpotContact'),
    email: byId('popupSpotEmail'), submit: byId('popupSpotSubmit'), status: byId('popupSpotStatus'),
    success: byId('popupSpotSuccess'), successPlace: byId('popupSpotSuccessPlace')
  };
  if (spotForm && Object.values(spot).every(Boolean)) {
    const eventName = byId('popupSpotName');
    wireForm({
      form: spotForm,
      fields: [spot.type, spot.place, spot.contact, spot.email],
      status: spot.status,
      submit: spot.submit,
      success: spot.success,
      messageFor: field => {
        if (field === spot.type && !field.value) return 'Bitte wähle aus, was für ein Spot es ist.';
        if (field === spot.place && !field.value.trim()) return 'Bitte gib den Ort oder die Adresse an.';
        if (field === spot.contact && !field.value.trim()) return 'Bitte gib deinen Namen an.';
        if (field === spot.email) return emailMessage(field, 'Bitte gib deine E-Mail-Adresse an, damit wir dir antworten können.');
        return '';
      },
      prepare: data => {
        data.set('subject', `Spot-Vorschlag: ${spot.type.value} in ${spot.place.value}`);
        data.set('replyto', spot.email.value);
      },
      onSuccess: () => {
        spot.successPlace.textContent = eventName?.value.trim() || spot.place.value;
      },
      texts: {
        sending: 'Dein Vorschlag wird gesendet …',
        failed: 'Dein Vorschlag konnte nicht gesendet werden. Deine Angaben bleiben erhalten, bitte versuche es gleich noch einmal.'
      }
    });
  }

  // Link „Spot anbieten“ neben dem Ticket: schaltet um und setzt den Fokus ins erste Feld.
  const spotLink = byId('popupSpotLink');
  const spotMode = byId('popupModeSpot');
  if (spotLink && spotMode && spot.type) {
    spotLink.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      spotMode.checked = true;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      byId('popupTicket')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'center' });
      spot.type.focus({ preventScroll: true });
    });
  }
})();
