import { Component, html, define, log } from '../../vision-stage.js'

// const stage = getStage()
// const app = stage.app

class ColorBox extends Component {

	template(){			
		return html`
			<button flow='row' @click=${ this.toggleProperty }>
				<span class="color-box" style='background-color:${this.color}'></span>
				<span class='label'>${ this.label }</span>
			</button>`
	}

	onConnected(){
		
		this.target_property = this.getAttribute('property')
		this.values = this.getAttribute('values').split(/\s*,\s*/)
		this.colors = this.getAttribute('colors').split(/\s*,\s*/)
		if( this.values.length !== this.colors.length){
			throw 'values and colors must be the same length'
		}
		const current_value = this.target[ this.target_property]
		this.current_index = this.values.indexOf( current_value) || 0
		this.color = this.colors[ this.current_index]
		//log('check', 'color:', this.color, 'index:', this.current_index)

		this.removeAttribute('property')
		this.removeAttribute('values')
		this.removeAttribute('colors')
		this.render()
	}

	toggleProperty(){
		const new_index = ++this.current_index % this.values.length
		this.color = this.colors[ new_index]
		this.target[ this.target_property] = this.values[ new_index]
		//log('check', 'this color:', this.color)
		this.render()
	}
}

ColorBox.properties = {

}

ColorBox.strings = {

}

define( 'button-colorbox', ColorBox)