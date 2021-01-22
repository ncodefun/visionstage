import { q, range } from '/vision-stage/modules/utils-core.js'
import { AppComponent, Component, html, define, log, getStage, useSVG } from '/vision-stage/vision-stage.js'

const stage = getStage()

class App extends AppComponent {

	onConnected(){
		this.render()
	}

	onUserDataReady( data){
		
	}

	afterFirstRender(){
		/// wait till now to not block app load/render
		Component.load('menu-scenes')
		Component.load('menu-options')
		Component.load('menu-auth2')
		this.faded = false
	}

	template(){
		return html`
		<menu-options class='side-menu left layer'></menu-options>
		<!-- <menu-auth2 class='side-menu right layer'></menu-auth2> -->
		<popup-full></popup-full>

		<header class=${ this.has_scenes ? 'has-scenes ' : '' }>
			<div flow class='top-corner-wrapper'> <!--/// to get the size of the grid area, to apply in menu header -->
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
			<button ?disabled=${!this.menu_auth} id='toggle-menu-auth' class='round ${this.UI_button_size_class}' 
				aria-label='autentification'
				@click=${ this.toggleMenuAuthOpen }
				>
				${ useSVG('android-person','','xMidYMid slice') }
				<div class='abs' show-for:role='admin'>
					<div id='access-level-label'>${ this.menu_auth&&this.menu_auth.user_role || '' }</div>
					${ this.subscriptions && html`							
						<div class="subscriptions-label admin">Subs&thinsp;:<br>
							${ this.subscriptions.map( sub => html`<div>${ sub }</div>`) || '' }
						</div>
					`}
				</div>
			</button>

			<menu-scenes flow='col top'
				strings:fr='A: Un, $jeu-B: Deux'
				strings:en='A: One, $jeu-B: Two'
				scene-param-index='0'>
			</menu-scenes>

			<div class="levels abs ${this.bypass_activity?'hide':''}" flow='row' show-for:scene='A B C D E'>
				${ range(3).map( n => html`
					<button class="level icon bare ${this.level===n ? 'selected' : ''}" 
						@mousedown=${ this.setLevel } .level=${n}>
						<img class='shadow' src='/vision-stage-resources/images/medals/medal-shadow-fill.png' alt="">
						<img class='abs bottom' src='/vision-stage-resources/images/medals/medal-${n}.png' alt="">
						<img class='abs top' src='/vision-stage-resources/images/medals/medal-top-${n}.png' alt="">
					</button>`
				)}
			</div>
			
			<p id='menu-scenes-message' class='fixed bottom text-center'>
				<strong>Cette application est gratuitement disponible durant sa période de développement.</strong><br>
				© 2020 Expertises didactiques Lyons inc.
			</p>
		</header>

		<main>

		</main>`
	}

	menuOptionsTemplate(){
		return html`
		<section></section>`
	}


	afterSceneChange(){

	}

	afterLevelChange(){ //!! -> onLevelChanged
		
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
	}
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

define( 'app-main', App)