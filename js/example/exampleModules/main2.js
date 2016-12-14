import { version } from './package.json';
export default function () {
	const message = `current version is ${version}`;
	export default () => console.log( message );
}