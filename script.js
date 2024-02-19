
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    //Play the first songs



    // Here showing the all songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
           <img class="invert" src="music.svg" alt="">
           <div class="info">
               <div>${song.replaceAll("%20", " ")}</div>
               
           </div>
           <div class="playnow">
               <span>Play Now</span>
               <img class="invert" src="playsong.svg" alt="">
           </div></li>`;
    }

    //Attach an event listener to each songs
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            Playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())


        })

    })
    return songs
}
const Playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)   
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00.00 / 00.00"
}
// async function displayAlbums() {
//     let a = await fetch(`http://127.0.0.1:5500/songs/`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     let cardContainer = document.querySelector(".cardContainer")
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];


//         if (e.href.includes("/songs")) {
//             let folder = e.href.split("/").slice(-2)[0]

           // get the metadata of the folder
            
            
        //     let a = await fetch(`http://127.0.0.1:5500/songs/mnc/info.json`);
        //     let response = await a.json();
        //     console.log(response)
        //     cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="ncs" class="card"> 
        //     <div class="play">
        //         <svg fill="#000000" height="50px" width="50px" version="1.1" id="Capa_1"
        //             xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        //             viewBox="-170.1 -170.1 550.20 550.20" xml:space="preserve" stroke="#000000"
        //             stroke-width="11.55">
        //             <g id="SVGRepo_bgCarrier" stroke-width="0"
        //                 transform="translate(2.1000000000000085,2.1000000000000085), scale(0.98)">
        //                 <rect x="-170.1" y="-170.1" width="550.20" height="550.20" rx="275.1" fill="#12f315"
        //                     strokewidth="0"></rect>
        //             </g>
        //             <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"
        //                 stroke="#CCCCCC" stroke-width="2.9400000000000004"></g>
        //             <g id="SVGRepo_iconCarrier">
        //                 <path d="M179.07,105L30.93,210V0L179.07,105z"></path>
        //             </g>
        //         </svg>
        //     </div>
        //     <img src="/songs/${folder}/cover.jpg" alt="">
        //     <h2>${response.title}</h2>
        //     <p>${response.description}</p>
        // </div>`
//         }
//     }

  

// }

async function main() {

    //Get the list of all Songs 
    songs = await getSongs("songs/Bhakti")
    Playmusic(songs[0], true)


    // displayAlbums()


    //Attach a event listener to play, next and previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "playsong.svg"
        }

    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    //Add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // add event listener to menu bar(hamburger)
    document.querySelector(".menu").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add event listener  to close button in the left side panel
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //add event listener to next and previous

    next.addEventListener("click", () => {
        console.log("Next Clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            Playmusic(songs[index + 1])
        }
    })
    
    previous.addEventListener("click", () => {
        console.log("Previous Clicked")
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index > 0) {
            Playmusic(songs[index - 1])
        }
    })
    

    //add an event to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",
        (e) => {
            console.log("Setting volume to", e.target.value, "/100")
            currentSong.volume = parseInt(e.target.value) / 100
            if (currentSong.volume >0){
                document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
            }

        })

   // add event listener to mute the track range

   document.querySelector(".volume>img").addEventListener("click",e=>{    
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume = .10
        document.querySelector(".range").getElementsByTagName("input")[0].value=10;
    }
   })


   Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        Playmusic(songs[0])
    })
})
}
main()




