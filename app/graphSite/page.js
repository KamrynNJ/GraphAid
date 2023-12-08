'use client'
//import { Chart } from "chart.js";
//Chart.register(Chart);
import Chart from 'chart.js/auto'
import React, { Component, useState, useRef, useEffect } from "react";
//import { addStyles, EditableMathField } from 'react-mathquill'
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import './graph.css';
const ChartJsImage = require('chartjs-to-image');
//import MyKeyboard from '../keyboard/page.js'

//Graphing Variables
var xValues = [];
var yValues = [];
let eq = "x^2";
let min = 5;
let max = -5;
let sent = false;
let chart;
let image;
let eq2;
var replacements = {
  'sin' : 'Math.sin',
  'cos' : 'Math.cos',
  'tan' : 'Math.tan',
  'arcsin' : 'Math.asin',
  'arccos' : 'Math.acos',
  'arctan' : 'Math.atan',
  'csc' : 'Math.asin',
  'sec' : 'Math.acos',
  'cot' : 'Math.atan',
  'sinh' : 'sinh',
  'cosh' : 'cosh',
  'tanh' : 'tanh',
  'arcsinh' : 'asinh',
  'arccosh' : 'acosh',
  'arctanh' : 'atanh',
  'csch' : 'asinh',
  'sech' : 'acosh',
  'coth' : 'atanh',
  'exp': 'Math.exp',
  'e': 'Math.E',
  'ln': 'Math.log',
  'log': 'Math.log10',
  'sqrt': 'Math.sqrt',
  '^': '**',
  'abs': 'Math.abs',
  'pi': 'Math.PI',
  'E': 'e',
  'np.np.log10': 'Math.log10',
  '÷': '/',
  'π': 'Math.PI',
  '√': 'Math.sqrt',
  '∛': 'Math.cbrt',


};
var allowed_words = [
  'x',
  't',
  'sin',
  'cos',
  'tan',
  'arcsin',
  'arccos',
  'arctan',
  'csc',
  'sec',
  'cot',
  'sinh',
  'cosh',
  'tanh',
  'arcsinh',
  'arccosh',
  'arctanh',
  'csch',
  'sech',
  'coth',
  'sqrt',
  'exp',
  'e',
  'ln',
  'log',
  'abs',
  'pi',
  '÷',
  'E',
  'π',
  '√',
  '∛',
];
//Graphing Variables End


function generateData(value, i1, i2, step = .1) {
  xValues = [];
  yValues = [];
  eq = value;
  for (let x = i1; x <= i2; x += step) {
    yValues.push(eval(value));
    xValues.push(x);
  }
}

function string2func(string) {
  var re = /[a-zA-Z_]+/g;
  if(string.match(re)==null){
    var words = string;
  }
  else{
    var words = string.match(re);
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (!allowed_words.includes(word)) {
          throw new Error('"' + word + '" is forbidden to use in math expression');
      }
    }
  }
  console.log(string);
  for (var key in replacements) {
    if (replacements.hasOwnProperty(key)) {
        var old = key;
        var new1 = replacements[key];
        string = string.replace(old, new1);
    }
  }
  return string;
}


function App() {
  const [inputs, setInputs] = useState({});
  const [layoutName, setLayoutName] = useState("default");
  const [inputName, setInputName] = useState("default");
  const keyboard = useRef();

  const [message, setMessage] = useState('')
  const [isLoaded, setIsLoaded] = useState(false);

  const onChangeAll = inputs => {
    /**
     * Here we spread the inputs into a new object
     * If we modify the same object, react will not trigger a re-render
     */
    setInputs({ ...inputs });
    console.log("Inputs changed", inputs);
  };

  const handleShift = () => {
    const newLayoutName = layoutName === "default" ? "shift" : "default";
    setLayoutName(newLayoutName);
  };

  const handleMath = () => {
    const newLayoutName = layoutName === "default" ? "math" : "default";
    setLayoutName(newLayoutName);
    //
    // this.setState({
    //   layoutName: layoutName === "default" ? "math" : "default"
    // });
  };

  const onKeyPress = button => {
    console.log("Button pressed", button);
    if (button === "{shift}" || button === "{lock}") handleShift();
    if (button === "{Math}") handleMath();
  };

  const onChangeInput = event => {
    const inputVal = event.target.value;
    sent = false;

    setInputs({
      ...inputs,
      [inputName]: inputVal
    });

    keyboard.current.setInput(inputVal);
    console.log("message:");
    console.log(message);
  };

  console.log(inputs);

  const getInputValue = inputName => {
    return inputs[inputName] || "";
  };

  const handleSubmit = event => {
    event.preventDefault();
    eq = inputs["Equation"];
    min = inputs["Min"];
    max = inputs["Max"];
    eq2 = inputs["Equation"];
    sent = true;
    chart.destroy();
    generateData(string2func(eq), Number(inputs["Min"]), Number(inputs["Max"]));
    Chart.defaults.font.size = 30;

    const plugin = {
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart, args, options) => {
        const {ctx} = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#99ffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };
    chart = new Chart("myChart", {
        type: "line",
        data: {
          labels: xValues,
          datasets: [{
            label: eq2,
            fill: false,
            pointRadius: 1,
            borderColor: "rgba(255,0,0,0.5)",
            data: yValues
          }],
        },
        options: {
          legend: {display: false},
          title: {
            display: true,
            // text: "x",
            fontSize: 16
          },
          plugins: {
            customCanvasBackgroundColor: {
              color: 'white',
            }
          },
          scales: {
            x: {
              ticks: {
                callback: (val, index, values) => {
                  return index % 10 === 0 ? Math.round(xValues[index]) : undefined;
                },
              },
            },
          },
        },
      plugins: [plugin],
    });
    image = chart.toBase64Image();


    // var a = document.createElement('a');
    // a.href = image;
    // a.download = 'my_file_name.png';
    //
    // // Trigger the download
    // a.click();
    return [eq,min,max,sent];
  };

 const keyboardShow = event =>{
   var x = document.getElementById("keyboard");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
 }

  // useEffect(() => {
  //   fetch("/sendImg")
  //     .then(res => res.json())
  //     .then(
  //       (result) => {
  //         setIsLoaded(true);
  //         setItems(result);
  //       },
  //       // Note: it's important to handle errors here
  //       // instead of a catch() block so that we don't swallow
  //       // exceptions from actual bugs in components.
  //       // (error) => {
  //       //   setIsLoaded(true);
  //       //   setError(error);
  //       // }
  //     )
  // }, [])
  const sendData = () => {
    //fetch('www.example.com/submit-form', { method: 'POST',
    // Specify the HTTP method body: new FormData(document.querySelector('form'))
     // Collect form data }) .then(response => response.text())
     // Read response as text .then(data => alert(data))
     // Alert the response
    const element = document.querySelector('#output');
    const requestOptions = {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ 'data': xValues, 'y': yValues, 'eq': eq2, 'min': Number(inputs["Min"]), 'max': Number(inputs["Max"])})
    };
    fetch("/api/sendImg", requestOptions)
       .then(response => response.json())
       .then(data => setMessage(data.message));
       //.then(data => element.innerHTML = data.id );

            //var value = document.getElementById('input').value;
            // $.ajax({
            //     url: '/sendImg',
            //     type: 'POST',
            //     contentType: 'application/json',
            //     data: JSON.stringify({ 'img': "hi" }),
            //     success: function(response) {
            //         document.getElementById('output').innerHTML = response.result;
            //     },
            //     error: function(error) {
            //         console.log(error);
            //     }
            // });
            console.log(image);
        }


  return (
    <div className="App">
      <div id="form">
        <div id="output"></div>
        <form onSubmit={handleSubmit}>
        <div id="equation">
          <label>
            Enter your Equation:
            <br />
            <input
              name="Equation"
              type="text"
              value={getInputValue("Equation")}
              onFocus={() => setInputName("Equation")}
              placeholder={"Enter Equation"}
              onChange={onChangeInput} />
          </label>
        </div>
        <br />
        <div id="maxIn">
          <label>
            Max:
            <br />
            <input
              name="Max"
              type="number"
              value={getInputValue("Max")}
              onFocus={() => setInputName("Max")}
              placeholder={"Max"}
              onChange={onChangeInput} />
          </label>
        </div>
        <br />
        <div id="minIn">
          <label>
            Min:
            <br />
            <input
              name="Min"
              type="number"
              value={getInputValue("Min")}
              onFocus={() => setInputName("Min")}
              placeholder={"Min"}
              onChange={onChangeInput} />
          </label>
        </div>
        <div class="buttons">
          <div id = "submit">
            <input type="submit" value="Graph"/>
          </div>
          <div id ="data">
            <button onClick={sendData}>Send Data</button>
          </div>
        </div>
      </form>
      <button onClick={keyboardShow} id = "showButton"> <img src={"/keyboard.png"}
        width={100}
        height={100}
        />
      </button>
    </div>
    <div id = 'keyboard'>
      <Keyboard
        keyboardRef={r => (keyboard.current = r)}
        inputName={inputName}
        layoutName={layoutName}
        onChangeAll={onChangeAll}
        onKeyPress={onKeyPress}
        layout={{
          default: [
            "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
            "{tab} q w e r t y u i o p [ ] \\",
            "{Math} a s d f g h j k l ; ' {enter}",
            "{shift} z x c v b n m , . / {shift}",
            ".com @ {space}"
          ],
          shift: [
            "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
            "{tab} Q W E R T Y U I O P { } |",
            '{Math} A S D F G H J K L : " {enter}',
            "{shift} Z X C V B N M < > ? {shift}",
            ".com @ {space}"
          ],
          math: [
            "0 1 2 3 4 5 6 7 8 9 {bksp}",
            "+ - * ÷ . , ( ) π e E ln log",
            '{Math} sin cos tan csc sec cot sinh cosh tanh {enter}',
            "csch sech coth ^ √ ∛ abs x",

          ]
        }}
        display={{
          '{bksp}': 'Delete',
          '{enter}': 'Enter',
          '{shift}': 'Shift',
          '{Math}': 'Math',
          '{tab}': 'Tab',
          '{space}': 'Space'
        }}
        theme={"hg-theme-default hg-layout-default keyboard"}
        />
      </div>
    </div>
  );
}



class Graph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Equation: "x",
      Max: 5,
      Min: -5,
    };
  }

  componentDidMount() {
    chart = new Chart(this.canvas, this.config);
    chart.destroy();
    console.log(min);
  }

  get config() {
    generateData(string2func(eq), this.state.Min, this.state.Max);
    const configData = {
        type: "line",
        data: {
          labels: xValues,
          datasets: [{
            label: eq2,
            fill: false,
            pointRadius: 1,
            borderColor: "rgba(255,0,0,0.5)",
            data: yValues
          }]
        },
        options: {
          legend: {display: false},
          title: {
            display: true,
            // text: "x",
            fontSize: 16
          }
        }
      };

    return configData;
  }

  render() {
    return (
      <main>
      <div class="everything">
        <div>
          <App />
        </div>
        <div id = "graph">
          <canvas
            id="myChart"
            ref={dom => this.canvas = dom}
          />
        </div>
      </div>
      </main>

    );
  }
}

export default Graph;
