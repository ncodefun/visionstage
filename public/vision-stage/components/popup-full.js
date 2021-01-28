import { log, Component, html, define, unsafeHTML } from '../vision-stage.js'
import { q } from '../modules/utils-core.js'

// log('ok', '-> popup-full')
const app = q('vision-stage')

class Popup extends Component {

	// constructor(){
	// 	super()
	// 	this.onAnswerHandler = {
	// 		handleEvent: this.onAnswer.bind( this),
	// 		capture: true
	// 	}
	// }

	onConnected(){
		//log('check', 'Popup connected' )
		app.popup = this
	}

	template(){
		return html`
		<header>${ unsafeHTML( this.message) }</header>
		${ this.input_mode ? html`<input type='text'>` : '' }
		<div class='buttons' flow='row' @click=${ this.onAnswer }>
			${ this.options && this.options.map( opt => html`<button class='big'>${ opt }</button>`) }
		</div>`
	}

	setMessage( msg, options=null){
		this.options = options

		this.message = Array.isArray( msg) ?
			msg.map( (m,i) => i===0 ? '<h1>'+m+'</h1>' : '<div>'+m+'</div>').join('') :
			'<h1>'+msg+'</h1>'
		/// so we can wait user response (let answer = await setMessage(...))
		return new Promise( (resolve, reject) => {
			this.modal_resolve = resolve
		})
	}

	onAnswer( e){
		if( e.target.localName !== 'button' ) 
			return 

		if( this.input_mode){
			this.modal_resolve( this.q('input').value)
			this.show = false
		}
		else {
			const answer = this.options.indexOf( e.target.textContent)
			this.modal_resolve( answer)
			this.show = false
		}
		this.input_mode = false
	}

	getInput( msg){
		this.input_mode = true
		this.message = msg
		this.options = ['OK']
		return new Promise( (resolve, reject) => {
			this.modal_resolve = resolve
		})
	}
}

Popup.properties = {
	message: {
		value: '',
		watcher( val){
			if( val){
				//this.answer = null
				this.show = true 
			}
		}
	},
	show: {
		value: false,
		attribute: ['shown', 'bool'], /// bool to remove or add as a "valueless" attr.
	},
}

define( 'popup-full', Popup)