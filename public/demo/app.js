import { q, range } from '/vision-stage/modules/utils-core.js'
import { VisionStage, Component, html, define, log, useSVG } from '/vision-stage/vision-stage.js'

class App extends VisionStage {

	onConnected(){
		this.render()
	}

	onUserDataReady( data){
		
	}

	afterFirstRender(){
		/// wait till now to not block app load/render
		Component.load('menu-scenes')
		Component.load('menu-options')
		// Component.load('menu-auth2')
		this.faded = false
	}

	template(){
		return html`
		<!-- <menu-auth2 class='side-menu right layer'></menu-auth2> -->
		<menu-options class='side-menu left layer'></menu-options>
		<popup-full></popup-full>

		<header>

			<div flow class='top-corner-wrapper'> <!-- to get the size of the grid area, to apply in menu options' header -->
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

	afterLevelChange(){
		
	}
	
}

App.aspect_ratios_v2 = {
	portrait: {	
		'min': .5, 									// extend stage height up to this, (content sticks at bottom)
		'min-content': .66, 				// extend content height up to this
		'base-content': .75, 				// base – min width for content
		'max': .85, 								// extend stage and content width up to this wide
	},
	threshold: 1.1,								// switch between portrait and landscape
	landscape: {
		'min': 1.333, 							// base – min width for content
		'max-content': 1.6, 				// extend content width up to this
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

define( 'vision-stage', App)