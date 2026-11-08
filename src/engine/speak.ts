// speak.ts makes the browser read Japanese aloud, using its built-in voice (no library, no key).

/** Can this browser speak? Some browsers have no speech, so we hide the 🔊 button there. */
export function canSpeak(): boolean {
  return 'speechSynthesis' in window
}

/** Read Japanese text aloud with the browser's voice. */
export function speak(text: string) {
  if (!canSpeak()) return // no speech here: do nothing instead of crashing

  speechSynthesis.cancel() // stop the last word, so taps don't pile up
  const say = new SpeechSynthesisUtterance(text)
  say.lang = 'ja-JP' // read it as Japanese
  say.rate = 0.9 // a bit slower, easier to follow
  speechSynthesis.speak(say)
}
