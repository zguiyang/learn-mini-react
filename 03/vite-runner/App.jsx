import React from "./core/React.js";


function Counter ({ num }) {
    return <div id="counter">count:{num}</div>
}

function CounterWrapper () {
    return (
        <div>
         <Counter num={10}></Counter>
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