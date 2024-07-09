import { hindiSongs, englishSongs } from "./data.js";

let currentSong = new Audio();
let songs = [];
let currentIndex = 0;

const cardContainers = Array.from(document.querySelectorAll(".cardContainer"));
const play = document.querySelector("#play");

const handlePlayMusic = (song) => {
  playMusic(song);
  songs.push({ name: song.name, href: song.href, artist: song.artist });
  console.log(songs);
};

const playMusic = (song, pause = false) => {
  currentSong.src = song.href;

  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(
    ".songinfo"
  ).innerHTML = `${song.name} - ${song.artist}`;

  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

const displayLibrarySongs = () => {
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  songUL.innerHTML = "";

  englishSongs.forEach((song) => {
    const div = document.createElement("div");
    const li = document.createElement("li");

    li.innerHTML = `
      <img class="invert" width="34" src="img/music.svg" alt="">
      <div class="info">
          <div>${song.name}</div>
          <div>${song.artist}</div>
      </div>
    `;

    div.innerHTML = `
      <span data-song=${song.href}>Play Now</span>
      <img class="invert" src="img/play.svg" alt="">
    `;
    div.classList.add("playnow");

    li.appendChild(div);
    songUL.appendChild(li);

    div.addEventListener("click", () => handlePlayMusic(song));
  });

  // const playNow = Array.from(document.querySelectorAll(".playnow"));
  // playNow.forEach((btn) => {
  //   // console.log(btn);
  //   btn.addEventListener("click", () => {
  //     console.log(btn.previousElementSibling.dataset.song);
  //     handlePlayMusic(btn.previousElementSibling.dataset.song);
  //   });
  // });
};

const displaySongs = (songsList, container) => {
  songsList.map((song) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <div data-folder="" class="card">
        <div class="play">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                  stroke-linejoin="round" />
          </svg>
        </div>

        <img src=${song.img} alt="">
        <h2>${song.name}</h2>
        <p>${song.artist}</p>
      </div>
    `;

    div.addEventListener("click", () => handlePlayMusic(song));

    container.appendChild(div);
  });
};

const main = () => {
  displaySongs(englishSongs, cardContainers[0]);
  displaySongs(hindiSongs, cardContainers[1]);
  displayLibrarySongs();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/ 100");
      currentSong.volume = parseInt(e.target.value) / 100;
      if (currentSong.volume > 0) {
        document.querySelector(".volume>img").src = document
          .querySelector(".volume>img")
          .src.replace("mute.svg", "volume.svg");
      }
    });

  // Add event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });

  // Add an event listener to previous
  previous.addEventListener("click", () => {
    const currentSrc = `./${currentSong.src.split("/").slice(3).join("/")}`;

    currentIndex = songs.findIndex((s) => s.href === currentSrc);
    if (currentIndex > 0) {
      currentIndex--;
      playMusic(songs[currentIndex]);
    }
  });

  // Add an event listener to next
  next.addEventListener("click", () => {
    const currentSrc = `./${currentSong.src.split("/").slice(3).join("/")}`;
    currentIndex = songs.findIndex((s) => s.href === currentSrc);

    if (currentIndex < songs.length - 1) {
      currentIndex++;
      playMusic(songs[currentIndex]);
    }
  });
};

main();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
