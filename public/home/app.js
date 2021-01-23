/* 
!! Questions
- possible problems with comps that renders or not (added / removed)
	can we use this uses correctly (the stored ref may not be good anymore? or is it the selector that's stored??)...


*/
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
		// Component.load('menu-scenes')
		// Component.load('menu-options')
		// Component.load('menu-auth2')
		// setTimeout( e => , 5000)
		
	}

	template(){
		return html`
		<!-- <div class='layer no-events' flow>
			<img src='./home/images/layout.png' class='layout' alt=''>
		</div> -->
		<header flow='col'>
			<div flow='row top'>
				<img src="/home/images/love-in-the-dark.png" class='' alt="" @load=${this.onImageLoaded}>
				<h1>Vision <span>Stage</span></h1>
			</div>
			<div id='tagline' flow='col left'>
				<p>Web apps in no time </p>
				<p>Simple components in <span class='highlight'>pure JS/HTML</span> <span class='icon'>🙏</span></p>
			</div>
		</header>

		<main flow='col top stretch'><!-- stretch otherwise content overflows?? -->

			<footer flow><a href='https://github.com/ncodefun/visionstage' target='_blank'>GitHub</a></footer>
		</main>`
	}

	menuOptionsTemplate(){
		return html`
		<section></section>`
	}

	afterSceneChange(){

	}

	onImageLoaded( e){
		this.faded = false
	}

	// onClickMore( e){
	// 	this.show_more = !this.show_more
	// }
}

App.aspect_ratios_v2 = {
	portrait: {	
		'min': .5, 									// extend stage height up to this, (content sticks at bottom)
		'min-content': .66, 				// extend content height up to this
		'base-content': .75, 				// base – min width for content
		'max': .75, 								// extend stage and content width up to this wide
	},
	threshold: 1.2,								// switch between portrait and landscape
	landscape: {
		'min': 1.333, 							// base – min width for content
		'max-content': 1.6, 				// extend content width up to this
		'max': 2								// extend stage width up to this
	},
	cross_margin: '1.2%',
	// ultrawide_cross_margin: '1.2%'
}

App.properties = {
	show_more: false,
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