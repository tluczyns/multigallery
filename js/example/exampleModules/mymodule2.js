function tryMe1(a) {
  console.log(a + 2);
}

var tryMe2 = 5678;

class myModule2 {
  tryMe3(a) {
    console.log(a + 100);
  }

  getTryMe1(a) {
    tryMe1(a);
  }

  getTryMe2() {
    return tryMe2;
  }
}

// Exports just myModule class. Not anything outside of it.
export default myModule2; 