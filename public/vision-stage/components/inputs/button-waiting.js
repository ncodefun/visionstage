import { log, Component, html, define, useSVG, unsafeHTML } from '../../vision-stage.js'

// use the user HTML as initial_content, or use a label string or prop
// loader 

// .waiting = false 
// .done = true => checkmark and a $label-done string


/**
 * Button which shows a waiting state when clicked, 
 * and can later show a completed state (checkmark) by setting .waiting = false or .done=true which displays a checkmark and a $label-done string
 * uses a CSS loader animation (div.loader)
*/
class ButtonWaiting extends Component {

	onConnected(){
		let initial_content = this.innerHTML.trim()
		//log('purple', 'meta button, this.initial_content ORIGINAL :', initial_content )
		if( initial_content) 
			this.initial_content = unsafeHTML( initial_content)
		//log('purple', 'meta button, this.initial_content HTML :', this.initial_content )
		this.color = this.hasAttribute('color') ? this.getAttribute('color') : ''
		//log('check', 'onConnected, color:', this)
		this.render()
	}
	
	onClick( e){
		this.waiting = true
		/// 
		// setTimeout( t => {
		// 	debugger
		// },100)
	}

	template(){
		//log('pink', 'meta button, this.initial_content :', this.initial_content || this.$label || this.label )
		return html`
		<button flow='col' type='button' @click=${ this.onClick } class=${this.color}>
			<div flow class=${ this.done||this.waiting ? 'hidden collapsed':'' }>${ this.initial_content || this.$label || this.label }</div>
			${
			this.done ? [html`<span>${this.$label_done}</span>`, useSVG('checkmark','dark')] : 
			this.waiting ? html`<div class='loader small'><div></div><div></div><div></div><div></div></div>` : 
			''
			}
		</button>
		`
	}
}

ButtonWaiting.properties = {
		done: {
			value: false,
			watcher( val){
				log("check",'done:',val)
				if( val===true)
					this.waiting = false
			}
		},
		waiting: false
}

define( 'button-waiting', ButtonWaiting)