import { Component, html, define, useSVG, unsafeHTML, log } from '../../vision-stage.js'

// const stage = getStage()
// const app = stage.app

/**
 * @property target {HTMLElement}
 * @property target_property {string}
 * @property label {string|HTMLString}
 * @property details {string} smaller text under main text
 */

class Checkbox extends Component {

	template(){
		//log('check', 'render checkbox', )
		this.active = this.active_value 
			? this.target[ this.target_property] === this.active_value
			: !!this.target[ this.target_property]
		return html`
			<button flow='row' @click=${ this.toggleProperty }>
				${ useSVG(`checkbox-${ this.active ? '':'un'}checked`, '','xMaxYMid meet') }
				<span class='label'>${ [unsafeHTML(this.label), this.details ? html`<small>${ this.details }</small>` : '' ] }</span>
			</button>`
	}

	onConnected(){
		//this.initial_text = unsafeHTML( this.innerHTML.trim())
		this.target_property = this.getAttribute('property')
		this.uses([[this.target, this.target_property]]) /// this must be auto rendered if target prop is changed from elsewhere
		this.removeAttribute('property')

		
		this.render()
	}

	toggleProperty(){
		let current_val = this.target[ this.target_property]
		let val 
		if( this.active_value !== undefined){
			val = this.active ? 0 : this.active_value
		}
		else {
			val = !current_val
		}
		//log('check', 'current_val, val:', current_val, val)
		this.target[ this.target_property] = val
		this.render() // sets this.active
	}
}

Checkbox.properties = {

}

Checkbox.strings = {

}

define( 'button-checkbox', Checkbox)