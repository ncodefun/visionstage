import { q, tempClass } from '/vision-stage/modules/utils-core.js'
import { Component, html, define, log, getStage } from '/vision-stage/vision-stage.js'

const stage = getStage()
const app = stage.app

class VSInputValues extends Component {

	onConnected(){
		this.setAttribute('flow','inline row')
		this.values = this.getAttribute('values').split(/,\s*|\s+/)
		this.addEventListener('click', this.remove.bind( this))
		// , | ,\s | \s
		this.render()
	}

	template(){
		return html`
		${this.values.map( (v,i) => html`<span class='value' .index=${i}>${v}</span> `)}
		<input type='text' size='3' @keydown=${this.onKeyDown}>
		<button @click=${this.commit}>→</button>
		`
	}

	afterFirstRender(){
		//
	}

	onKeyDown( e){
		//log('check', 'e.key:', e.key)
		if( e.key === 'Enter' || e.key===' '){
			this.commit()
		}
	}

	remove( e){
		//log('check', 'remove', e.currentTarget)
		if( e.target.classList.contains('value')){
			let i = e.target.index
			//log('check', 'is value, index:', i)
			this.values.splice(i,1)
			this.render()
			this.onUpdated()
		}
	}

	commit( e){
		let val = parseInt( this.q('input').value)
		if( val){
			this.values.push( val)
			this.q('input').value = ''
			this.q('input').focus()
			this.onUpdated()
		}
		else {

		}

		this.render()
	}
}

VSInputValues.properties = {

}

VSInputValues.strings = {

}

define( 'vs-input-values', VSInputValues)
