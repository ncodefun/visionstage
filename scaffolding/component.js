import { Component, html, define, log, getStage } from '/vision-stage/vision-stage.js'
import { q, tempClass } from '/vision-stage/modules/utils-core.js'

const stage = getStage()
const app = stage.app

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
