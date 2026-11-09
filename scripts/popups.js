// Pop-up-Abstimmung mit Warteliste. Ohne JS sendet das Formular direkt an Web3Forms.
(() => {
  const form = document.getElementById('popupVoteForm');
  if (!form || !window.fetch || !window.FormData || !window.AbortController) return;

  const byId = id => document.getElementById(id);
  const place = byId('popupVotePlace');
  const email = byId('popupVoteEmail');
  const consent = byId('popupVoteConsent');
  const submit = byId('popupVoteSubmit');
  const status = byId('popupVoteStatus');
  const success = byId('popupVoteSuccess');
  const successPlace = byId('popupVoteSuccessPlace');
  if (![place, email, consent, submit, status, success, successPlace].every(Boolean)) return;

  const fields = [place, email, consent];
  const times = Array.from(form.querySelectorAll('.popups-vote-times input[type="checkbox"]'));
  const originalSubmit = submit.innerHTML;
  let pending = false;
  let attempted = false;

  const messageFor = field => {
    if (field === place && !place.value.trim()) return 'Bitte gib eine Postleitzahl oder einen Ort an.';
    if (field === email && !email.value.trim()) return 'Bitte gib deine E-Mail-Adresse an, damit wir dir Bescheid geben können.';
    if (field === email && email.validity.typeMismatch) return 'Bitte gib eine gültige E-Mail-Adresse an, zum Beispiel name@beispiel.de.';
    if (field === consent && !consent.checked) return 'Bitte bestätige, dass wir dir das erste Pop-up per E-Mail ankündigen dürfen.';
    return '';
  };

  const setError = (field, message) => {
    const id = `${field.id}Error`;
    let error = byId(id);
    if (message && !error) {
      error = document.createElement('span');
      error.id = id;
      error.className = 'popups-vote-error';
      (field === consent ? field.closest('label') : field).insertAdjacentElement('afterend', error);
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
    field.addEventListener(field === consent ? 'change' : 'input', () => {
      if (attempted || field.hasAttribute('aria-invalid')) setError(field, messageFor(field));
    });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    attempted = true;
    place.value = place.value.trim();
    email.value = email.value.trim();

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

    // Zeitwünsche als ein Feld senden, Betreff mit Ort erleichtert das Zählen im Postfach.
    const data = new FormData(form);
    const chosenTimes = times.filter(input => input.checked)
      .map(input => input.dataset.label || input.closest('label').textContent.trim());
    times.forEach(input => data.delete(input.name));
    data.set('Wann', chosenTimes.length ? chosenTimes.join(', ') : 'keine Angabe');
    data.set('subject', `Pop-up-Stimme: ${place.value}`);

    const controls = Array.from(form.querySelectorAll('input, button'));
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    pending = true;
    form.setAttribute('aria-busy', 'true');
    controls.forEach(control => { control.disabled = true; });
    submit.textContent = 'Wird gesendet …';
    setStatus('Deine Stimme wird gesendet …', 'sending');
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
        successPlace.textContent = place.value;
        form.hidden = true;
        success.hidden = false;
        const alternative = byId('popupVoteAlt');
        if (alternative) alternative.hidden = true;
        setStatus('');
        focusTarget = success;
      } else {
        setStatus('Deine Stimme konnte nicht gesendet werden. Deine Angaben bleiben erhalten, bitte versuche es gleich noch einmal.', 'error');
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
})();
