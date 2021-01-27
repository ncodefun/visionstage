/* 
? Questions
- possible problems with comps that renders or not (if added / removed)
	can we use this.uses correctly (the stored ref may not be good anymore? or is it the selector that's stored??)...
*/
// import { q, range } from '/vision-stage/modules/utils-core.js'
import { VisionStage, html, define, log } from '/vision-stage/vision-stage.js'

class App extends VisionStage {

	onConnected(){
		this.render()
	}

	template(){
		return html`
			<div id='title-row' flow='row top'>
				<img id='logo' src="/home/images/love-in-the-dark.png" class='' alt="" @load=${this.onImageLoaded}>
				<h1 id='title'>Vision <span>Stage</span></h1>
			</div>

			<div id='tagline' flow='col'>
				<p><span class='highlight'>Modern Web apps</span> in no time </p>
				<p><span class='highlight'>Pure JS/HTML</span> components <span class='icon highlight'>🙏</span></p>
			</div>

			<div id='feat' flow='col'>
				<div>App/stage component – frame & resize (rem) content for universal aspect control</div>
				<div>Menu components for scenes, options and auth</div>
				<div>Easy localization, SVG icons, sounds, intuitive flex layout and more&hairsp;!</div>
			</div>
			
			<div id='details'>
				<strong>••• ZERO TOOLS •••</strong><br>
				keep it simple – stop waisting your time with overkill frameworks and monster tools…
				<br>
				Focus on what counts – <strong>start to create&hairsp;!!</strong>
			</div>

			<div id='included'>

			</div>

			<footer id='main-footer' flow>
				<a href='https://github.com/ncodefun/visionstage' target='_blank'>GitHub</a>
			</footer>`
	}

	menuOptionsTemplate(){
		return html`
		<section></section>`
	}

	afterFirstRender(){
		/// wait till now to not block app load/render
		// Component.load('menu-scenes')
		// Component.load('menu-options')
		// Component.load('menu-auth2')
		this.faded = false
	}

	afterSceneChange(){
		//
	}

	onUserDataReady( data){
		//
	}

	onImageLoaded( e){
		//this.faded = false
	}
}

App.aspect_ratios = {
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
		'max': 2.1									// extend stage width up to this
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

define( 'vision-stage', App)