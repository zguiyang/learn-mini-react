import React from "./core/React.js";


let count = 10;
function Counter ({ num }) {
  function handleClick () {
    console.log('click')
    count++;
    React.update();
  }
    return (
      <>
        <div id="counter">count:{count}</div>
        <button onClick={handleClick}>点我</button>
      </>
    )
}

function CounterWrapper() {
    return (
        <div>
         {/*<Counter num={10}></Counter>*/}
         <Counter num={20}></Counter>
        </div>
    )
}
function App() {
 return (
     <div id="app">
         hello world
         {/*<Counter num={10}></Counter>*/}
         <CounterWrapper></CounterWrapper>
     </div>
 )
}
export default App;