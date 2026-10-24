const floatingLayer = document.getElementById("floating-layer");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function makeFloaty() {
  if (reducedMotion) return;
  const item = document.createElement("span");
  const symbols = ["♡", "♥", "✧", "✦"];
  item.className = `floaty ${Math.random() > 0.55 ? "star" : ""}`;
  item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  item.style.left = `${Math.random() * 100}%`;
  item.style.fontSize = `${12 + Math.random() * 17}px`;
  const duration = 8 + Math.random() * 7;
  item.style.animationDuration = `${duration}s`;
  floatingLayer.appendChild(item);
  window.setTimeout(() => item.remove(), duration * 1000 + 200);
}
if (!reducedMotion) {
  for (let i = 0; i < 10; i++) window.setTimeout(makeFloaty, i * 300);
  window.setInterval(makeFloaty, 1000);
}

const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }),
);

const envelope = document.getElementById("envelope");
const letterContent = document.getElementById("letter-content");
const envelopeHint = document.getElementById("envelope-hint");
envelope.addEventListener("click", () => {
  const isOpen = envelope.classList.toggle("open");
  envelope.setAttribute("aria-expanded", String(isOpen));
  letterContent.hidden = !isOpen;
  envelopeHint.textContent = isOpen
    ? "A little note, from my heart to yours ♡"
    : "Tap the envelope to open your letter";
  if (isOpen)
    setTimeout(
      () =>
        letterContent.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "center",
        }),
      220,
    );
});

const memoryDialog = document.getElementById("memory-dialog");
const dialogText = document.getElementById("dialog-text");
document.querySelectorAll("[data-memory]").forEach((card) =>
  card.addEventListener("click", () => {
    dialogText.textContent = card.dataset.memory;
    if (typeof memoryDialog.showModal === "function") memoryDialog.showModal();
    else alert(card.dataset.memory);
  }),
);
document
  .getElementById("dialog-close")
  .addEventListener("click", () => memoryDialog.close());
memoryDialog.addEventListener("click", (event) => {
  if (event.target === memoryDialog) memoryDialog.close();
});

// Three playlist rows; add matching files in assets/music/ to enable playback.
const tracks = [
  {
    title: "Until I Found You",
    subtitle: "A song for my beloved",
    src: "assets/music/Until-i-found-you.mp3",
  },
  {
    title: "I'm Yours",
    subtitle: "I am always yours, my love",
    src: "assets/music/I'm-yours.mp3",
  },
  {
    title: "On my mind",
    subtitle: "always thinking of you, my love",
    src: "assets/music/On-My-Mind.mp3",
  },
];
const audio = document.getElementById("audio-player");
const mainPlay = document.getElementById("main-play");
const nowTitle = document.getElementById("now-title");
const nowStatus = document.getElementById("now-status");
const progressFill = document.getElementById("progress-fill");
const disc = document.getElementById("disc");
const trackRows = [...document.querySelectorAll(".track")];
let currentTrack = 0;

function chooseTrack(index, autoPlay = true) {
  currentTrack = index;
  const track = tracks[index];
  trackRows.forEach((row, i) => {
    row.classList.toggle("active", i === index);
    row.querySelector(".track-play").textContent =
      i === index && !audio.paused ? "Ⅱ" : "▶";
  });
  nowTitle.textContent = track.title;
  audio.src = track.src;
  progressFill.style.width = "0%";
  nowStatus.textContent = "Ready to play ♡";
  if (autoPlay) {
    audio.play().catch(() => {
      nowStatus.textContent = `Add ${track.src} to play this song ♡`;
      mainPlay.textContent = "▶";
      disc.classList.remove("playing");
      trackRows.forEach(
        (row) => (row.querySelector(".track-play").textContent = "▶"),
      );
    });
  }
}
trackRows.forEach((row, index) => {
  row.querySelector(".track-play").addEventListener("click", () => {
    if (currentTrack === index && !audio.paused && audio.src) audio.pause();
    else chooseTrack(index, true);
  });
  row.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    chooseTrack(index, true);
  });
});
mainPlay.addEventListener("click", () => {
  if (!audio.src) chooseTrack(currentTrack, true);
  else if (audio.paused)
    audio.play().catch(() => {
      nowStatus.textContent = `Add ${tracks[currentTrack].src} to play this song ♡`;
    });
  else audio.pause();
});
audio.addEventListener("play", () => {
  mainPlay.textContent = "Ⅱ";
  nowStatus.textContent = "Now playing ♡";
  disc.classList.add("playing");
  trackRows.forEach(
    (row, i) =>
      (row.querySelector(".track-play").textContent =
        i === currentTrack ? "Ⅱ" : "▶"),
  );
});
audio.addEventListener("pause", () => {
  mainPlay.textContent = "▶";
  disc.classList.remove("playing");
  trackRows.forEach(
    (row, i) => (row.querySelector(".track-play").textContent = "▶"),
  );
  if (!audio.ended && audio.currentTime > 0) nowStatus.textContent = "Paused";
});
audio.addEventListener("timeupdate", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0)
    progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
});
audio.addEventListener("ended", () => {
  if (currentTrack < tracks.length - 1) chooseTrack(currentTrack + 1, true);
  else {
    progressFill.style.width = "0%";
    nowStatus.textContent = "Playlist complete ♡";
  }
});
audio.addEventListener("error", () => {
  nowStatus.textContent = `Add ${tracks[currentTrack].src} to play this song ♡`;
});

const notes = [
  "You do not have to be perfect to be loved. Just be you, my baby. ♡",
  "A tiny reminder: your dreams matter, your feelings matter, and you matter to me.",
  "I hope something good finds you today. If not, I hope you find a little peace. ☾",
  "Drink some water, take a deep breath, and remember that you are doing your best. ✧",
  "Even from far away, I am cheering for you and all the little steps you take.",
];
let noteIndex = 0;
document.getElementById("new-note").addEventListener("click", () => {
  noteIndex = (noteIndex + 1) % notes.length;
  document.getElementById("note-response").textContent = notes[noteIndex];
  if (!reducedMotion)
    for (let i = 0; i < 5; i++) window.setTimeout(makeFloaty, i * 120);
});

const revealButton = document.getElementById("reveal-surprise");
const secretMessage = document.getElementById("secret-message");
revealButton.addEventListener("click", () => {
  const show = secretMessage.hidden;
  secretMessage.hidden = !show;
  revealButton.textContent = show
    ? "Close your surprise ♡"
    : "Open your surprise ♡";
  document.getElementById("gift-icon").textContent = show ? "💙" : "🎁";
  if (show) {
    if (!reducedMotion)
      for (let i = 0; i < 14; i++) window.setTimeout(makeFloaty, i * 100);
    setTimeout(
      () =>
        secretMessage.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "center",
        }),
      100,
    );
  }
});
document.getElementById("yes-button").addEventListener("click", () => {
  document.getElementById("answer-message").textContent =
    "Yay! Here’s to more laughter, little adventures, and sweet memories together. ♡";
  if (!reducedMotion)
    for (let i = 0; i < 18; i++) window.setTimeout(makeFloaty, i * 90);
});
document.getElementById("maybe-button").addEventListener("click", () => {
  document.getElementById("answer-message").textContent =
    "That’s okay, baby. No rush—good memories are made with care, one day at a time. ☁";
});
