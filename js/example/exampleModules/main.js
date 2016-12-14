import MyModule from './MyModule';
import MyModule2 from './MyModule2';


let bar = new MyModule();
let bar2 = new MyModule();

//tryMe1(1); // ReferenceError: tryMe1 is not defined
//tryMe2; // ReferenceError: tryMe2 is not defined
//bar.tryMe1(1); // TypeError: bar.tryMe1 is not a function
bar.tryMe2; // undefined

bar.tryMe3(1); // 101
bar.getTryMe1(1); // 3
console.log(bar.getTryMe2()); // 1234





//bar2.tryMe1(1); // TypeError: bar.tryMe1 is not a function
bar2.tryMe2; // undefined

bar2.tryMe3(1); // 101
bar2.getTryMe1(1); // 3
bar2.setTryMe2(5555);

console.log(bar2.getTryMe2()); // 1234

console.log(bar.getTryMe2()); 