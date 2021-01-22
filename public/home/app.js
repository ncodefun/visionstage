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
		this.faded = false
	}

	template(){
		return html`
		<main flow='col top stretch'><!-- stretch otherwise content overflows?? -->
			<img src="/home/images/love-in-the-dark.png" class='' alt="">
			<h1>Vision Stage</h1>
			<p id='tagline'>A web framework for <span class='nowrap'>free spirits</span> <span class='icon'>🙏</span></p>
			<p>Simple components <span>pure JS/HTML (lit-html templating), <wbr>ES modules -> No build required!!</span></p>
			<p>Staged content <span>rem scaled and spaced/framed <wbr>within flexible limits</span></p>
			<hr>
			<button class='bare' @click=${ this.onClickMore }>${ this.show_more ? 'Less…' : 'More…' }</button>
			<section id='more' class=${ this.show_more ? '' : 'hide' }>
				<!-- <p>Awesome helpers</p> -->
				<p>Flow attribute for intuitive flex layout <span>flow='col top stretch'</span></p>
				<p>Insert an icon symbol from icons.svg <span>\${ useSVG('thumbs-up') }</span></p>
				<p>Use a localized string <span>\${ this.getString('name') } <wbr>or this.$name</span></p>
				<p>Declare rendering dependency <span>this.uses([[comp,prop1,prop2]])</span></p>
				<hr>
				<h2>App Component</h2>	
				<p>Callbacks <span>onConnected, afterFirstRender, afterRender, <wbr>afterResize, afterSceneChange</span></p>
				<p>Built-in functional menus <span>scenes, <wbr>options (+ fullscreen & lang selection), <wbr>authentication (Firebase)</span></p>
				<p>Play a sound <span>this.playSound(name)</span></p>
				<hr>
				<h2>Built-in components</h2>	
				<p>full-stage dynamic popup <span>await & alert or get user input w/ buttons or text</span></p>
				<p>button-waiting, button-checkbox, range-slider, super-selector (user editable) and more.</p>
			</section>
			<footer flow><a href='https://github.com/ncodefun/visionstage' target='_blank'>GitHub</a></footer>
		</main>`
	}

	menuOptionsTemplate(){
		return html`
		<section></section>`
	}

	afterSceneChange(){

	}

	onClickMore( e){
		this.show_more = !this.show_more
	}
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
		'max': 1.777								// extend stage width up to this
	},
	// cross_margin: '1.2%',
	ultrawide_cross_margin: '1.2%'
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