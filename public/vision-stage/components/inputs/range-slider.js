import { Component, html, define, log, ifDefined } from '../../vision-stage.js'
//import { q } from '../../modules/utils-core.js'

//const app = q('vision-stage')

class RangeSlider extends Component {
	
	constructor(){
		super()
		this.min = this.getAttribute('min')
		this.removeAttribute('min')
		this.max = this.getAttribute('max')
		this.removeAttribute('max')
		this.step = this.getAttribute('step')
		this.removeAttribute('step')
	}

	template(){
		return html`
		<input type="range" min=${this.min} max=${this.max} step=${ifDefined(this.step)}
			value=${ this.value }
			@input=${ this.onInput }
			@change=${ this._onChange }>
		`
	}

	onConnected(){
		this.style.setProperty('--value-percent', this.value+'%')
		this.render()
	}

	onInput( e){
		this.value = e.target.value
		//log('check', 'value:', this.value)
		this.style.setProperty('--value-percent', this.value+'%')
	}

	_onChange( e){
		this.onChange( this.value, e.target)
	}
}

RangeSlider.properties = {
	value: 0
}

RangeSlider.strings = {

}

define( 'range-slider', RangeSlider)