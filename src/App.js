import {useState, useEffect, useRef} from 'react';
import './App.css';

const countTime = 10000;

function getRandomInt({
  min,
  max,
}) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}

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
  const [q,setQ] = useState(null);

  useEffect(()=>{
    if(action === "RUNNING" && q){
      const link = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=th-TH&q=${q}&rd=${getRandomInt({
        min: 0,
        max: 50000000
      })}`;
      console.log(link);
      const ttsPopup = window.open(link,'popUpWindow','height=400,width=300,left=0,top=0,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
      setTimeout(()=>{
        console.log("Closed");
        // ttsPopup.close();
      },countTime-2000)
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
      },countTime/3)

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
    setCounter(countTime/1000)
    console.log("Run");
    if(action === "RUNNING"){
      nextNumber();
    }
  },action === "RUNNING" ? countTime : null)

  function start(){
    setCounter(countTime/1000)
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
          <button
            onClick={start}
          >
            Start
          </button>
        )
      }
    }
  }
  

  return (
    <div className="App">
      <header className="App-header">
        {/* <iframe src="https://translate.google.com/translate_tts?ie=UTF-8&tl=th-TH&client=tw-ob&q=hello"></iframe> */}
        { action === "RUNNING" && <div>นับถอยหลัง {counter} วินาที</div>}
        <div style={{display: 'flex', flexWrap: "wrap"}}>
          {numbers.length > 0 && numbers.map((n,i)=><div style={{
            color: i >= numbers.length-1 ? "red" : "#fff",
            border: "1px solid #fff",
            margin: 10,
            padding: 10,
            font: "4em"
            }} key={i}> {n} </div>)}
        </div>
        {getActionBtn()}
        {/* <Speech lang="th-TH" text="12" /> */}
        {/* <audio ref={audioEle} src="" className="speech"></audio> */}
        {/* <a href="https://asktofolks.com/" onclick="window.open('#','_blank');window.open(this.href,'_self');">Open a new tab in background</a> */}
        
      </header>
    </div>
  );
}

export default App;
