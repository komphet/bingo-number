import {useState, useEffect, useRef} from 'react';
import './App.css';

function getRandomInt({
  min,
  max,
}) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}

var synth = window.speechSynthesis;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

let genInterval,counterInterval;

function App() {
  const [numbers,setNumbers] = useState([]);
  const [action,setAction] = useState("STOP");
  const [counter,setCounter] = useState(0);
  const [countTime,setCountTime] = useState(8);
  const [q,setQ] = useState(null);

  useEffect(()=>{
    if(action === "RUNNING" && q){
      // const link = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=th-TH&q=${q}&rd=${getRandomInt({
      //   min: 0,
      //   max: 50000000
      // })}`;
      // console.log(link);
      // const ttsPopup = window.open(link,'popUpWindow','height=400,width=300,left=0,top=0,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
      var utterThis = new SpeechSynthesisUtterance(q);
        utterThis.lang = "th-TH";
        utterThis.pitch = 1;
        utterThis.rate = .7;
        synth.speak(utterThis);
      setQ(null);
    }
  },[q,action]);

  function nextNumber(){
    const randomNumber = getRandomInt({
      min: 1,
      max: 75,
    });

    if(numbers.length >= 75){
      pause();
      return;
    }

    if(!numbers.includes(randomNumber)){
      setNumbers([...numbers,randomNumber]);
      setQ(randomNumber);
      setTimeout(()=>{
        setQ(randomNumber);
      },(countTime*1000)/3)

    } else {
      nextNumber();
    }
  }

  counterInterval = useInterval(()=>{
    if(action === "RUNNING" && counter > 0){
      setCounter(counter-1)
    }
  },action === "RUNNING" ? 1000 : null)

  genInterval = useInterval(()=>{
    setCounter(countTime)
    console.log("Run");
    if(action === "RUNNING"){
      nextNumber();
    }
    const focused = document.querySelector('.focus')
    focused.scrollIntoView({ behavior: 'smooth' })
  },action === "RUNNING" ? countTime*1000 : null)

  function start(){
    setCounter(countTime-1)
    nextNumber();
    setAction("RUNNING");
  }

  function pause(){
    setAction("PAUSED")
    clearInterval(genInterval);
    clearInterval(counterInterval);
  }

  function reset(){
    clearInterval(genInterval);
    clearInterval(counterInterval);
    setAction("STOP")
    setNumbers([]);
  }

  function getActionBtn(){
    switch(action){
      case "RUNNING": {
        return (
          <button
            onClick={pause}
          >
            Pause
          </button>
        )
      }
      case "PAUSED": {
        return (
         <div>
            <button
            onClick={start}
          >
            Continue
          </button>
            <button
            onClick={reset}
          >
            Reset
          </button>
         </div>
        )
      }
      default: {
        return (
          <div style={{
            fontSize: ".5em"
          }}>
            นับถอยหลัง
            <input 
            style={{
              color: "#fff",
              background: "none",
              border: "none",
              margin: 10,
              width: 30,
              textAlign: "center"
            }}
            value={countTime}
            onChange={(e)=>setCountTime(e.target.value)}
            placeholder="เวลานับถอยหลัง (วินาที)"></input>
            วินาที
            {" "}
            <button
              onClick={start}
            >
              Start
          </button>
          </div>
        )
      }
    }
  }

  function getActionfunction(){
    switch(action){
      case "RUNNING": {
        return pause
      }
      case "PAUSED": {
        return start
      }
      default: return start;
    }
  }
  

  return (
    <div className="App">
      <header className="App-header">
        {/* <iframe src="https://translate.google.com/translate_tts?ie=UTF-8&tl=th-TH&client=tw-ob&q=hello"></iframe> */}
        <div style={{position: "absolute", top: 20, right: 20}}>{action === "RUNNING" && <span style={{fontSize: ".5em"}}>
          นับถอยหลัง {counter} วินาที</span>} {getActionBtn()}
          </div>
        
        <button onClick={getActionfunction()} style={{
            color: "#f7c035",
            border: `1px solid #f7c035`,
            margin: 10,
            padding: 10,
            minWidth: "150px",
            height: "150px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "none",
            cursor: "pointer",
            fontSize: "4em"
            }} > {numbers.length > 0 ? numbers[numbers.length-1] : "Start"} </button>

        <div style={{
            display: 'flex', 
            flexWrap: "wrap", 
            maxWidth: 700, 
            maxHeight: 200, 
            overflow: "auto",
            marginTop: 20,
            overflowX: "hidden",
            overflowY: "scroll",
          }}>
          {numbers.length > 0 && numbers.map((n,i)=><div 
          className={i >= numbers.length-1 ? "focus" : ""}
          style={{
            color: i >= numbers.length-1 ? "#f7c035" : "",
            border: `1px solid ${i >= numbers.length-1 ? "#f7c035" : "#fff"}`,
            margin: 10,
            padding: 10,
            width: "50px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1em"
            }} key={i}> {n} </div>)}
        </div>
        {/* <Speech lang="th-TH" text="12" /> */}
        {/* <audio ref={audioEle} src="" className="speech"></audio> */}
        {/* <a href="https://asktofolks.com/" onclick="window.open('#','_blank');window.open(this.href,'_self');">Open a new tab in background</a> */}
        
      </header>
    </div>
  );
}

export default App;
