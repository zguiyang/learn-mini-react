import React from "./core/React.js";


let count = 10;
function Counter ({ num }) {
  const update = React.update();
  console.log('counter render')
  function handleClick () {
    count++;
   update();
  }
    return (
      <>
        <div id="counter">count:{count}</div>
        <button onClick={handleClick}>点我count</button>
      </>
    )
}

let showBar = false;
let bar = 2;
function Foo () {
  console.log('foo')
  const [count, setCount] = React.useState(0);
    const [str, setStr] = React.useState('hello');
  function handleClick () {
   setCount(1);
   // setStr('word');
    setStr('hello');
  }
  return (
    <div>
      { count }
      <div></div>
      { str }
      <div></div>
      <button onClick={handleClick}>点我Foo</button>
  </div>
  )
}

function Bar () {
  console.log('bar render')
  const update = React.update();
  function handleClick () {
    bar++;
    update();
  }
  return (
    <div>
      { bar }
      <button onClick={handleClick}>点我Bar</button>
    </div>
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
  console.log('App render')
  const update = React.update();
  function handleClick () {
    showBar = !showBar;
    update();
  }
 return (
     <div id="app">
         hello world
         {/*<Counter num={10}></Counter>*/}
         {/*<CounterWrapper></CounterWrapper>*/}
         <div>
           {/*{showBar ? <Bar></Bar> : <Foo></Foo>}*/}
           {/*{ showBar && <Bar></Bar> }*/}
         </div>

       <Foo></Foo>
       <Bar></Bar>
       {/*<button onClick={handleClick}>切换组件</button>*/}
     </div>
 )
}
export default App;