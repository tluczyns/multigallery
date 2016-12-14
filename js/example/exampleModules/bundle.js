'use strict';

function tryMe1(a) {
  console.log(a + 2);
}

var tryMe2 = 1234;

class myModule {
  tryMe3(a) {
    console.log(a + 100);
  }

  getTryMe1(a) {
    tryMe1(a);
  }
  
  setTryMe2(a) {
    tryMe2 = a;
  }
  
  getTryMe2() {
    return tryMe2;
  }
}

let bar = new myModule();
let bar2 = new myModule();

// undefined

bar.tryMe3(1); // 101
bar.getTryMe1(1); // 3
console.log(bar.getTryMe2()); // undefined

bar2.tryMe3(1); // 101
bar2.getTryMe1(1); // 3
bar2.setTryMe2(5555);

console.log(bar2.getTryMe2()); // 1234

console.log(bar.getTryMe2());