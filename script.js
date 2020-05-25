
//SPLASH INTERACTION
const splash = document.querySelector("#splash")
const splashClick = document.querySelector("#click")

splashClick.addEventListener("click", () => {
  splash.style.display = "none"
})
splashClick.addEventListener("mouseenter", () => {
  splash.style.opacity = "0.8"
})
splashClick.addEventListener("mouseleave", () => {
  splash.style.opacity = "1"
})

//SLIDER CONTROLS
const reverb1 = document.querySelector("#reverb1")
const reverb2 = document.querySelector("#reverb2")
const reverb3 = document.querySelector("#reverb3")
const delay1 = document.querySelector("#delay1")
const delay2 = document.querySelector("#delay2")
const delay3 = document.querySelector("#delay3")
const db1 = document.querySelector("#volume1").value
const db2 = document.querySelector("#volume2").value
const db3 = document.querySelector("#volume3").value

//TONE SOUNDS
const synth1 = new Tone.Synth({
    "oscillator": {
        "partials": [
            1,
            0,
            2,
            0,
            3
        ]
    },
    "envelope": {
        "attack": 0.001,
        "decay": 0.8,
        "sustain": 0.3,
        "release": 1.2
    }
}) 
const synth2 = new Tone.Synth({
    "oscillator": {
        "type": "fatcustom",
      	"partials" : [0.2, 1, 0, 0.5, 0.1],
      	"spread" : 40,
      	"count" : 3
    },
    "envelope": {
        "attack": 0.001,
        "decay": 1.6,
        "sustain": 0,
        "release": 1.6
    }
}) 
const synth3 = new Tone.Synth({
    "oscillator" : {
        "type" : "fatsawtooth",
        "count" : 3,
        "spread" : 10
    },
    "envelope": {
        "attack": 0.2,
        "decay": 0.2,
        "sustain": 0.3,
        "release": 1,
        "attackCurve" : "exponential"
    }
}) // this creates a synth and connects it to speakers
const freeverb1 = new Tone.Freeverb({roomSize  : 2 ,dampening  : 800}).toMaster()
const freeverb2 = new Tone.Freeverb({roomSize  : 2 ,dampening  : 500}).toMaster()
const freeverb3 = new Tone.Freeverb({roomSize  : 2 ,dampening  : 500}).toMaster()
const ppdelay1 = new Tone.PingPongDelay(0.25, 0.5).toMaster()
const ppdelay2 = new Tone.PingPongDelay(0.25, 0.5).toMaster()
const ppdelay3 = new Tone.PingPongDelay(0.25, 0.5).toMaster() 
const octiveDown = new Tone.PitchShift([-12]).toMaster();
synth1.set("volume", db1)
synth2.set("volume", db2)
synth3.set("volume", db3)
synth1.connect(ppdelay1).connect(freeverb1)
synth2.connect(ppdelay2).connect(freeverb2)
synth3.connect(ppdelay3).connect(freeverb3)
ppdelay1.wet.value = 0
ppdelay2.wet.value = 0
ppdelay3.wet.value = 0
freeverb1.wet.value = 0
freeverb2.wet.value = 0
freeverb3.wet.value = 0
octiveDown.wet.value = 1
  
//CONTROLS FOR ALL SLIDERS  
const slider = document.querySelectorAll(".slider")  
slider.forEach( slide => {
  slide.addEventListener("input", e => {
    const value = e.target.value
    const id = e.target.id
    const column1 = document.querySelector("#column1")
    const column2 = document.querySelector("#column2")
    const column3 = document.querySelector("#column3")
    if (id === "reverb1") {
      freeverb1.wet.value = value/100
      column1.style.transition = "background-color " + value/70 + "s";
    } else if (id === "reverb2") {
      freeverb2.wet.value = value/100
      column2.style.transition = "background-color " + value/70 + "s";
    } else if (id === "reverb3") {
      freeverb3.wet.value = value/100
      column3.style.transition = "background-color " + value/70 + "s";
    } else if (id === "volume1") {
      synth1.set("volume", value);
    } else if (id === "volume2") {
      synth2.set("volume", value);
    }
    else if (id === "volume3") {
      synth3.set("volume", value);
    } else if (id === "delay1") {
      ppdelay1.wet.value = value/100
    } else if (id === "delay2") {
      ppdelay2.wet.value = value/100
    } else if (id === "delay3") {
      ppdelay3.wet.value = value/100
    }
  })
})
  
  
// GENERATE SCALE BUTTONS
const allScales = teoria.Scale.KNOWN_SCALES;
const scaleList = document.querySelector("#scalelist");
allScales.forEach(function(scale) {
  const button = document.createElement("button");
  button.innerHTML = scale;
  scaleList.appendChild(button);
  button.classList.add("scalechoice")
})
  
 //DISPLAY CURRENT SCALE. 
const scaleDisplayElement = document.querySelector("#scaledisplay")


//DISPLAY SCALE LIST ON HOVER
scaleDisplayElement.addEventListener("mouseenter", e => {
  scaleList.style.display = "block";
})
scaleList.addEventListener("mouseleave", e => {
  scaleList.style.display = "none"
  scaleList.style.backgroundColor = "white"
})
  
//SCALE DEFINITION FUNCTION
const scaleDisplay = document.querySelector("#scaledisplay");
scaleDisplay.innerHTML = "Scale: major";
let currentScale = getScale("c4", "major");
function getScale(root, scale) {
  return teoria.scale(root, scale).notes().map(function(note){
    return note.midi()
    
  })
}

//BUTTON EVENTLISTENER 
const scaleButtons = document.querySelectorAll(".scalechoice");
scaleButtons.forEach(button => {
  button.addEventListener("click", function(e) {
    let scale = e.target.innerHTML;
    let root = "c4"; // this can be changed, but will be the root of the scales;
    currentScale = getScale(root, scale);
    scaleDisplay.innerHTML = "Scale: " + scale;
  })
});

 
  
//PLAY RANDOM NOTE 
function playRandomNote(id) {
  let synth
  let num = Math.floor(Math.random()*currentScale.length);
  let frequency = Tone.Frequency(currentScale[num], "midi");
  if (id === "column1") {
    synth = synth1;
  } else if (id === "column2") {
    synth = synth2
  } else if (id === "column3") {
    synth = synth3
  } else {
    return false;
  }
  synth.triggerAttackRelease(frequency, 0.2);
}
//FUNCTION THAT CHANGES BACKGROUND COLOR OF EACH COLUMN and CALLS playRandomNote() EVERY 1000ms  
function changeBackground(element) {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      element.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')'; //this changes the background color every second
    }




// THIS ADDS EVENT LISTENERS FOR EACH COLUMN  
const  columns = document.querySelectorAll('.column') 
columns.forEach(column => { // this returns an array of all objects with class .column
  column.addEventListener("click", function(e) { //for each of those objects we attach an event listener
    let element = e.target; //the e.target will be the specific object
    let id = element.id;
    changeBackground(element)
    playRandomNote(id);
    if (element.classList.contains("column")) {
      startInterval(element, id) //this calls the function with the input of the event's target
    }
  } 
                          // ,{once: true}
  ) //once the element has been clicked, bgChange() is no longer called
})


  
//SLIDE BAR TOP
const topContainer = document.querySelector("#topcontainer")
columns.forEach(column => {
  column.addEventListener("click", ()=> {
    topContainer.style.transform = "translateY(-30%)"
  })
})


//SLIDE BAR BOTTOM
const bottomContainer = document.querySelector("#bottomcontainer");
const arrow = document.querySelector("#arrow")
bottomContainer.addEventListener("mouseenter", e => {
  e.target.style.transform = "translateY(10px)"
  e.target.style.opacity = "1"
  arrow.style.transform = "rotate(180deg)"
  arrow.style.transition = "transform 1s"
  
})
bottomContainer.addEventListener("mouseleave", e => {
  e.target.style.transform = "translateY(170px)"
  e.target.style.opacity = 0.4
  arrow.style.transform = "rotate(360deg)"
  arrow.style.transition = "transform 1s"
})


  
  
//COLOR GENERATE FUNCTION FOR HOVER COLUMNS
//FUNCTION THAT GENERATES RANDOM BGR COLOR ON PAGE LOAD
//APPLY COLOR TO EACH OF THE COLUMNS
//INITIAL STATE HOVERING
columns.forEach(column => {
  column.setAttribute("data-clicked", false)
})
  
columns.forEach(column => {
  column.addEventListener("click", function(e) {
    column.setAttribute("data-clicked", true)
    column.style.transition = "background-color 0s"
  })
  column.addEventListener("mouseenter", e => {
    if (column.getAttribute("data-clicked") == 'false') {
      let element = e.target
      let id = e.target.id
      column.style.transition = "background-color 0s"
      changeBackground(element)
      playRandomNote(id)
    }
  })
  column.addEventListener("mouseleave", function(e) {
    if (column.getAttribute("data-clicked") == 'false') {
      e.target.style.backgroundColor = "white"
      column.style.transition = "background-color 0s"

    }
  })
})               

  //FUNCTION CHANGES BG COLOR AND PLAYS RANDOM NOTE EVERY SECOND
var flash;
const startInterval = (element, id) => { //this function has an input, element, retrieved from the function below  
  if (id) {
    flash = setInterval(() => {
      changeBackground(element)
      playRandomNote(id)
    }, 1000)
  }  
}
// CLEAR INTERVAL
const reset = document.querySelector("#reset")
reset.addEventListener("click", function(i) {
  columns.forEach(column => {
    column.style.backgroundColor = "white"
    column.style.transition = "background-color 2s"
    column.setAttribute("data-clicked", false)
  });
  for(i=0; i<100; i++) //clears the all intervalss
  {
    window.clearInterval(i)
  }
})


  
  
  
  
  