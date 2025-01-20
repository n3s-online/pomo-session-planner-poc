export const SOUNDS = {
  announce: "announce.wav",
  beep: "beep.wav",
  bells: "bells.wav",
  confirmation: "confirmation.wav",
  magic: "magic.wav",
};

export const playSound = (soundName: string, volume = 1) => {
  if (soundName in SOUNDS === false) {
    throw new Error(`Sound "${soundName}" not found`);
  }
  const audio = new Audio(
    `/pomo-session-planner-poc/sounds/${
      SOUNDS[soundName as keyof typeof SOUNDS]
    }`
  );
  audio.volume = volume;
  return audio.play();
};
