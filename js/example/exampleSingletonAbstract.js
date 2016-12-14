import {trace} from 'base/Globals.js'
import Singleton from 'base/types/Singleton.js';
import Abstract from 'base/types/Abstract.js';

SingletonOne = class nameSingletonOne extends Singleton {
	constructor() {
		super();
	}
}

class SingletonTwo extends Singleton {}

class NadAbstrakt extends Abstract {}

class NadNadAbstrakt extends NadAbstrakt {}
	 
var singletonOne1 = new SingletonOne(); //ok
//var singletonOne2 = new SingletonOne(); //error
var singletonTwo1 = new SingletonTwo(); //ok
//var singletonTwo2 = new SingletonTwo(); //error

var nadNadAbstrakt = new NadNadAbstrakt(); //ok
//var nadAbstrakt = new NadAbstrakt(); //error