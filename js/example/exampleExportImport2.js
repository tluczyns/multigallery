//function nameFunction1() {} //exporting function has the same behaviour as exporting class
class nameClass1 {}
var nameVariable1 = 5;

//with 'export default «expression»' «expression» has to be evaluatable
export default nameClass1; //ok
export default nameVariable1; //ok
export default class nameClass2 {}; //ok
//export default var nameVariable2; //bad
export default class {}; //ok

//with 'export «declaration»' «declaration» has to be result of expression
//export nameClass1 //bad
//export nameVariable1; //bad
export class nameClass3 {}; //ok
export var nameVariable3; //ok
//export class {}; //bad