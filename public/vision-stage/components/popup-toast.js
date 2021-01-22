import { log, Component, html, define, getStage } from '../vision-stage.js'
log('ok', '-> popup-toast')
const stage = getStage()

class Toast extends Component {

	onConnected(){
		//log('check', 'toast connected' )
		stage.toast = this
	}

	template(){
		return html`
		<header>${ this.message }</header>
		<div class='buttons' flow='row' @click=${ this.onAnswer }>
			${ this.options && this.options.map( opt => html`<button class='big'>${ opt }</button>`) }
		</div>`
	}

	setMessage( msg, options=null){
		this.options = options
		this.message = msg
		/// so we can wait user response (let answer = await setMessage(...))
		return new Promise( (resolve, reject) => {
			this.modal_resolve = resolve
		})
	}

	onAnswer( e){
		if( e.target.tagName !== 'BUTTON' ) return 
		this.answer = this.options.indexOf( e.target.textContent)
		this.modal_resolve( this.answer)
		this.show = false
	}
}

Toast.properties = {
	message: {
		value: '',
		watcher( val){
			if( val){
				this.answer = null
				this.show = true 
			}
		}
	},
	show: {
		value: false,
		attribute: ['shown', 'bool'], /// bool to remove or add as a "valueless" attr.
	},
}

define( 'popup-toast', Toast)