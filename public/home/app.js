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
			<img src='./home/images/layout5.png' class='layout' alt=''>
		</div> -->
		
			<div id='title-row' flow='row top'>
				<img id='logo' src="/home/images/love-in-the-dark.png" class='' alt="" @load=${this.onImageLoaded}>
				<h1 id='title'>Vision <span>Stage</span></h1>
			</div>

			<div id='tagline' flow='col'>
				<p><span class='highlight'>Modern Web apps</span> in no time </p>
				<p><span class='icon'>→</span> <span class='highlight'>Pure JS/HTML</span> components! <span class='icon'>🙏</span></p>
			</div>
			<section flow='col'>
				<p class='no-nothing'>no custom syntax, no monster API, no preprocessing, no bundling, no shadow DOM…</p>
				<p class='simple'>Just a minimal and <button class='bare inline'>intuitive API</button></p>
			</section>
			<footer id='main-footer' flow><a href='https://github.com/ncodefun/visionstage' target='_blank'>GitHub</a></footer>`
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
//3C3F44
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