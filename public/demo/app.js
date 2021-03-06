import { q, range } from '/vision-stage/modules/utils-core.js'
import { VisionStage, Component, html, define, log, useSVG } from '/vision-stage/vision-stage.js'

class App extends VisionStage {

	onConnected(){
		this.render()
	}

	afterFirstRender(){
		// this way we're not blocking app load/render
		Component.load('menu-scenes')
		Component.load('menu-options')
		Component.load('menu-auth')
		this.faded = false
	}

	template(){
		return html`
		<menu-auth class='side-menu right layer'></menu-auth>
		<menu-options class='side-menu left layer'></menu-options>
		<popup-full></popup-full>

		<header>
			<div flow class='top-corner-wrapper'>
				<button ?disabled=${!this.menu_options} id='toggle-menu-options' class='round ${this.UI_button_size_class}'
					aria-label='menu des options'
					@click=${ this.toggleMenuOptionsOpen }>
					${ useSVG('navicon-round','','xMidYMid slice') }
				</button>
			</div>

			<div id='title-banner-pill' class='title-banner' flow @click=${ this.toggleMenuScenes }>
				<h1>${ this.$title }</h1>
				<button id='selected-title' class='bare abs'>
					${this.menu_scenes&&this.menu_scenes.getString( this.scene)}
					${ useSVG('fanion','fanion layer', 'none', '0 -10 100 120') }
				</button>
			</div>

			${
				this.menu_auth ? html`
				<button ?disabled=${!this.menu_auth} id='toggle-menu-auth' class='round ${this.UI_button_size_class}' 
					aria-label='autentification'
					@click=${ this.toggleMenuAuthOpen }
					>
					${ useSVG('android-person','','xMidYMid slice') }
				</button>`
				: html`<button class='dummy'></button> `
			}

			<!-- scene names syntax: "$game-B: Game B" -> prefix $ to distinguish scenes from other strings, or use a single letter key -->
			<menu-scenes flow='col top'
				strings:fr='A: Un, B: Deux, C: Trois'
				strings:en='A: One, B: Two, C: Three'
				scene-param-index='0'>
			</menu-scenes>
			
			<p id='menu-scenes-message' class='fixed bottom text-center'>
				<strong>Dev notes.</strong><br>
				© 2021 inc.
			</p>
		</header>

		<main flow='col space-between'>
			<header>Headr</header>
			<div show-for:scene='A'>Scene A</div>
			<div show-for:scene='B'>Scene B</div>
			<div show-for:scene='A C'>Scenes A & C</div>
			<footer >Foo</footer>
		</main>`
	}

	menuOptionsTemplate(){
		return html`
		<section></section>`
	}

	afterSceneChange(){

	}
}

App.firebase_config = {

}

App.aspect_ratios = {
	portrait: {	
		'min': .5, 									// extend stage height up to this, (content sticks at bottom)
		'min-content': .66, 				// extend <main> height up to this
		'base-content': .75, 				// base – min width for <main>
		'max': .85, 								// extend stage/<main> width up to this wide
	},
	threshold: 1.1,								// switch between portrait and landscape
	landscape: {
		'min': 1.333, 							// base – min width
		'max-content': 1.6, 				// extend <main> width up to this
		'max': 1.777								// extend stage width up to this
	},
	cross_margin: '1.2%',					// if dead space on one axis, add margins on the other (looks better…)
}

App.properties = {

}

App.strings = {
	fr: {

	},
	en: {
		
	}
}

App.sounds = [
	// ['good', '/vision-stage-resources/sounds/good.mp3'],
	// ['wrong', '/vision-stage-resources/sounds/wrong.mp3', { volume:.6 }],
]


define( 'vision-stage', App, []) 
// -> we can declare required comps (JS & CSS) to be loaded 
// -> app definition (customElements.define) will wait once all are loaded
// -> For non critical components, use Component.load()