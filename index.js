import './style';
import { Component } from 'preact';
import TestComponent from './lib/src/testComponent';

export default class App extends Component {
	render() {
		return (
			<div>
				<TestComponent></TestComponent>
				<h1>Hello, World!</h1>
			</div>
		);
	}
}
