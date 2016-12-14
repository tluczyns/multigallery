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

// Exports just myModule class. Not anything outside of it.
export default myModule; 