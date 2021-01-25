import { Component, html, define, log } from '/vision-stage/vision-stage.js'
import { q, tempClass } from '/vision-stage/modules/utils-core.js'

class MyComp extends Component {

	onConnected(){
		this.render()
	}

	template(){
		return html`
		
		`
	}

	afterFirstRender(){

	}
}

MyComp.properties = {

}

MyComp.strings = {

}

define( 'my-comp', MyComp)
