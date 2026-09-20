export default function() {
    let videoAktif = true;
    let terakhirToggle = 0;
    let currentBPM = 120;
    let targetPlaybackRate = 1;
    let currentPlaybackRate = 1;
    let lastTrackURI = null;
    let currentBeat = 0;

 
    const video_link = "https://raw.githubusercontent.com/thorryn1/corbon-guitar-synced/main/CorbonPlayGuitar_fixed.webm";
    const videoGlow_link = "https://raw.githubusercontent.com/thorryn1/corbon-guitar-synced/main/CorbonPlayGuitar_glow.webm";
    const video = document.createElement("video");
    video.src = video_link;
    const videoGlow = document.createElement("video");
videoGlow.src = videoGlow_link;

    video.style.position = "fixed";
    video.style.zIndex = "9999";
    video.style.width = "9.6vw";
    video.style.aspectRatio = "1/1"; // 1:1 yaa
    //dynamic posisi
    const playerBar = document.querySelector(".Root__now-playing-bar");
    const tinggiPlayer = playerBar.offsetHeight;
    const posisiBottom = (tinggiPlayer - 29) + "px";
video.style.bottom = posisiBottom;


    const volBtn = document.querySelector(".volume-bar__icon-button");
const volRect = volBtn.getBoundingClientRect();
const jarakDariKanan = window.innerWidth - volRect.left;
video.style.right = (jarakDariKanan + 360) + "px";


    // sistem loop dan video
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    videoGlow.autoplay = true;
    videoGlow.muted = true;
    videoGlow.loop = true;
    //style glow
    videoGlow.style.position = "fixed";
videoGlow.style.zIndex = "9999";   // bisa lebih tinggi dari video utama
videoGlow.style.width = "9.6vw";
videoGlow.style.aspectRatio = "1/1";
videoGlow.style.bottom = posisiBottom;
videoGlow.style.right = (jarakDariKanan + 360) + "px";
videoGlow.style.opacity = "0";    // ← default: transparan (nggak keliatan)
    document.body.appendChild(video);
    document.body.appendChild(videoGlow);
    console.log("video udh di append");
    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.key === "d") {
            e.preventDefault();
            const sekarang = Date.now();
            if (sekarang - terakhirToggle > 300) {
                terakhirToggle = sekarang;
                if (videoAktif === true) {
        Spicetify.showNotification("GUITAR OFF", false, 2000);
    } else {
        Spicetify.showNotification("GUITAR ON", false, 2000);
    }
                toggleVideo();
            }
        }
    })

    setInterval(() => {
        const uri = Spicetify.Player.data?.item?.uri;
        if (!uri || uri === lastTrackURI) return;
        lastTrackURI = uri;
        console.log("NEW SONG:", Spicetify.Player.data.item.name);
        updateBPM();
    }, 1000);

    function mainLoop() {
        
        const diff = targetPlaybackRate - currentPlaybackRate;
        currentPlaybackRate += diff * 0.04;
        if (Math.abs(diff) < 0.01) currentPlaybackRate = targetPlaybackRate;

        const beatInterval = 60000 / currentBPM;
        const phase = (performance.now() % beatInterval) / beatInterval;
        const hold = 0.15;
const adjustedPhase = Math.max(0, (phase - hold) / (1 - hold));
const beat = Math.pow(1 - adjustedPhase, 25);

        const diffBeat = beat - currentBeat;
currentBeat += diffBeat * 0.4

        
        if (!video.paused &&  videoAktif) {
           const slow = 0.05;
const fast = 5.0;
    const rate = currentPlaybackRate * (slow + (1 - currentBeat) * (fast - slow));
    video.playbackRate = Math.max(0.1, rate);
    videoGlow.style.opacity = currentBeat > 0.05 ? currentBeat : "0";
        } else {
            videoGlow.style.opacity = "0";
        }
        requestAnimationFrame(mainLoop);
    }

    async function updateBPM() {
        const audioData = await fetchAudioData();
        const bpm = audioData?.track?.tempo;
        if (bpm && bpm > 0) {
            currentBPM = bpm;
            applyBPM(bpm);
            console.log("CORBON BPM:", bpm);
        }
    }

    Spicetify.Player.addEventListener("onplaypause", () => {
        if(Spicetify.Player.isPlaying()) {
            video.play();
            videoGlow.play();
        } else {
            video.pause();
            videoGlow.pause();
        }
    });

    function updatePosition() {
    const tinggiPlayer = playerBar.offsetHeight;
    const volRect = volBtn.getBoundingClientRect();
    const jarakDariKanan = window.innerWidth - volRect.left;

   const posisiBottom = (tinggiPlayer - 92) + "px";
const posisiRight = (jarakDariKanan + 219) + "px";

    video.style.bottom = posisiBottom;
    video.style.right = posisiRight;
    videoGlow.style.bottom = posisiBottom;
    videoGlow.style.right = posisiRight;
    
}
setInterval(updatePosition, 100);

    async function fetchAudioData() {
        const uri = Spicetify.Player.data?.item?.uri;
        if (!uri) throw new Error("No Track URI");
        const id = uri.split(":").pop();
        return await Spicetify.CosmosAsync.get(`wg://audio-attributes/v1/audio-analysis/${id}?format=json`);
    }

    function applyBPM(bpm) {
        if(!bpm || bpm <= 0) return;
        const velocity = bpm / 120;
        targetPlaybackRate = Math.max(0.5, Math.min(2, velocity));
    }

       function toggleVideo() {
        if (videoAktif === true) {
            video.style.display = "none";
            videoGlow.style.display = "none";
            videoAktif = false;
        } else {
           video.style.display = "block";
           videoGlow.style.display = "block";
            videoAktif = true;
        }
    }
    if (!Spicetify.Player.isPlaying()) {
    video.pause();
    videoGlow.pause();
}

    mainLoop();
    applyBPM(120);
}
    
    // position: fixed; z-index: 9999; width: 9.6vw; aspect-ratio: 1 / 1; bottom: 1px; right: 365px;
    //ffmpeg -c:v libvpx-vp9 -i "D:\corbon-guitar-synced\assets\CorbonPlayGuitar.mov" -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -metadata:s:v:0 alpha_mode="1" -b:v 3M "D:\corbon-guitar-synced\assets\CorbonPlayGuitar_fixed.webm"