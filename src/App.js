import {useState, useRef} from 'react';
import './App.css';
// import Speech from 'react-speech';
// import * as googleTTS from 'google-tts-api';
const fs = require('fs');
const tts = require('google-translate-tts');


function App() {

  const audioEle = useRef();

  // const [numberList,setNumberList] = useState([]);

  // function getRandomInt(min, max) {
  //   min = Math.ceil(min);
  //   max = Math.floor(max);
  //   const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  //   if(numberList.includes(randomNumber)){
  //     return getRandomInt(min, max);
  //   }
  //   setNumberList([...numberList,randomNumber]);
  //   return randomNumber;
  // }
  const fetchAudio = async (word)=> {
    const requestOptions = {
      method: 'get',
      headers: {
        // ":authority": "translate.google.com",
        // ":method": "GET",
        // ":path": "/translate_tts?ie=UTF-8&tl=th-TH&client=tw-ob&q=hello",
        // ":scheme": "https",
        // "Content-Type": "application/json",
        // 'Access-Control-Allow-Origin': '*',
        "accept": "*/*",
        "authorization": "Bearer AIzaSyCNNqEpUaGeOk3eVoQ6jJ_BaI56SgT6JH4",
        "accept-encoding": "identity;q=1, *;q=0",
        "accept-language": "th,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "cache-control": "no-cache",
        "cookie": "_ga=GA1.3.605681493.1613921071; SID=9wcIEK1dmTLQrFiisAkZHGj8w5Cfl3KfOQiO-ye9XVIBAc_h0OA2WRFTbWdjXapUgMco1g.; __Secure-3PSID=9wcIEK1dmTLQrFiisAkZHGj8w5Cfl3KfOQiO-ye9XVIBAc_hDXeW5Uqnma1OBaVfcgehPw.; HSID=Am49gxyMcC-LOP-nH; SSID=AeH5hM_BWs-BZ90JE; APISID=nhxfALTbe_aHGK8E/Avv2L5Np_rd_14JTq; SAPISID=c_tc8sb_T_NIKgJT/AdETza4rFA4gG2oR_; __Secure-3PAPISID=c_tc8sb_T_NIKgJT/AdETza4rFA4gG2oR_; OTZ=5995529_28_28__28_; OGPC=19024399-1:748494848-4:; 1P_JAR=2021-06-06-14; NID=216=HkBbF8DB1aYRUzstLfmmsXzSdKLrthgZ89gWItBeBva_D9n3ClLc4Ohj1Y6j1fIVjd5b7FXRNBdpeuld-4Mw3em4jJ90J2VmWuLVkFhJ1HKETX4ttpN4Gl3v-yzEimP4PpzUYwKc2RRLPggOEKE_vQWtaap2qiBBhlFMjkIUUOrSw7uRHxNbU2BJOPo90jV2AXz-ktYLSmHVJamzjCM_thmVvv4mrxF71uaOIy--z_pzpZJAiUKjJrWVlWv66RKPWBNFs8gflzNd6ymr27eRuKQxe_0; SIDCC=AJi4QfGWbEOrUO-4A5M00P-dI8D6kz3oSSKVi69fxiwFO6Ft-QSAs7BezbiYk0PZax7kvTmc_e0; __Secure-3PSIDCC=AJi4QfGTtT7ayVLwn2lbyYeIYpHKVMNQtIO8oSUFcd0caRf_OB7TTuedutkTKwJ25lFTJ6Kfhs4",
        "pragma": "no-cache",
        "range": "bytes=0-",
        "referer": "https://translate.google.com/translate_tts?ie=UTF-8&tl=th-TH&client=tw-ob&q=hello",
        "sec-ch-ua": '" Not;A Brand";v="99", "Microsoft Edge";v="91", "Chromium";v="91"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "video",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.41"
        
      },
      // body: JSON.stringify({ "word": word })
    };
    let url = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=th-TH&client=tw-ob&q=hello';
    // fetch() returns a promise that
    // resolves once headers have been received
    return fetch(url, requestOptions)
      .then(res => {
        if (!res.ok)
          throw new Error(`${res.status} = ${res.statusText}`);
        // response.body is a readable stream.
        // Calling getReader() gives us exclusive access to
        // the stream's content
        var reader = res.body.getReader();
        // read() returns a promise that resolves
        // when a value has been received
        return reader
          .read()
          .then((result) => {
            return result;
          });
      })
  }
  function playSound(){
    tts.synthesize({
        text: 'Hello, world!',
        voice: 'en-US',
        slow: false // optional
    }).then(buffer=>{
      fs.writeFileSync('hello-world.mp3', buffer);
    })

    
    
    // get base64 text
    // googleTTS
    //   .getAudioBase64('Hello World', {
    //     lang: 'en',
    //     slow: false,
    //     host: 'https://translate.google.com',
    //     timeout: 10000,
    //   })
    //   .then(console.log) // base64 text
    //   .catch(console.error);
  // var url = "https://translate.google.com/translate_tts?ie=UTF-8&tl=th-TH&client=tw-ob&q=hello";
    // audioEle.attr('src', url).get(0).play();
    // audioEle.current.setAttribute('src',url);
    // audioEle.current.play();

    // fetchAudio("Hello")
    //   .then((response) => {
    //     // response.value for fetch streams is a Uint8Array
    //     var blob = new Blob([response.value], { type: 'audio/mp3' });
    //     var url = window.URL.createObjectURL(blob)
    //     console.log(url);
    //     // window.audio = new Audio();
    //     // window.audio.src = url;
    //     // window.audio.play();
    //   })
    //   .catch((error) => {
    //    console.log(error);
    //   });
  }
  
  return (
    <div className="App">
      <header className="App-header">
        {/* <iframe src="https://translate.google.com/translate_tts?ie=UTF-8&tl=th-TH&client=tw-ob&q=hello"></iframe> */}
        <h1>
          Hello
        </h1>
        {/* <Speech lang="th-TH" text="12" /> */}
        <audio ref={audioEle} src="" className="speech"></audio>
        
        <button
          onClick={playSound}
        >
          Start
        </button>
      </header>
    </div>
  );
}

export default App;
