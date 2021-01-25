import { Component, html, define, log, useSVG } from '../vision-stage.js'
import { q } from '../modules/utils-core.js'
import screenfull from '../modules/screenfull.js'

const app = q('vision-stage')

class MenuOptions extends Component {
	
	constructor(){
		super()
		//app = q('vision-stage')
		app.menu_options = this
		// this._onClick = this.onClick.bind( this)
		// this.addEventListener('click', this._onClick)
	}

	template(){
		//log('check', 'render menu options')
		const langs = app.langs
		return html`
		<div class="menu-body" flow='col stretch'>
			<header>
				${ app.langTemplate ? app.langTemplate() : html`
					<ul class='lang-options' flow='row space-evenly' @click=${ this.setLang }>
					${
						langs.map( lang => html`
							<li><button class='bare medium square pseudo-link ${ app.lang === lang ? 'active':'' }'><div class='text'>${lang.toUpperCase()}</div></button></li>`)
					}
					</ul>`
				}
				<button id='fullscreen-toggle' class='icon round ${app.UI_button_size_class}' aria-label=${ this.$fullscreen }
					@click=${ this.toggleFullscreen }>
					${ useSVG('fullscreen-' + (screenfull.isFullscreen ? 'exit':'enter') ) }
				</button>
			</header>

			<section flow='row' id='adjust-volume'>
				<span aria-hidden>🔉</span>
				<range-slider
					id='volume-slider'
					min="0" max="100" step='5'
					.value=${  Math.round( app.global_volume*100) }
					.onChange=${ this.onVolumeChange }>
				</range-slider>
				<span aria-hidden>🔊</span>
			</section>

			<!--//  APP's options  //-->
			${ app.menuOptionsTemplate && app.menuOptionsTemplate() }
			<hr class='split'>
			${ app.menuOptionsBottomTemplate && app.menuOptionsBottomTemplate() }

			<section id="install-app" flow='row left'>

				<button id='install-btn' class='icon round' aria-label=${ this.$install0 }
					@click=${ app._onClickInstall }>
					<svg viewbox='0 0 30 32' class='download'>
						<path d="M0 24.512v-2.336q0-1.056 0.768-1.792t1.824-0.768 1.792 0.768 0.768 1.792v2.336q0 0.544 0.384 0.928t0.96 0.416h16.992q0.576 0 0.96-0.416t0.384-0.928v-2.336q0-1.056 0.768-1.792t1.792-0.768 1.824 0.768 0.768 1.792v2.336q0 2.688-1.888 4.576t-4.608 1.92h-16.992q-2.688 0-4.608-1.92t-1.888-4.576zM4.96 13.024q0-1.056 0.768-1.824 0.736-0.736 1.792-0.736t1.824 0.736l3.36 3.392v-11.008q0-1.056 0.768-1.824t1.792-0.736 1.824 0.736 0.768 1.824v11.008l3.52-3.52q0.768-0.768 1.824-0.768t1.792 0.768q0.768 0.736 0.768 1.792t-0.768 1.824l-7.904 7.904q-0.768 0.8-1.824 0.8-1.024 0-1.792-0.8l-7.744-7.744q-0.768-0.768-0.768-1.824z"></path>
					</svg>
					<svg viewbox='0 0 30 32' class='add'>
						<path d="M14.88 1.696q5.888 0 10.08 4.192T29.152 16 24.96 26.08t-10.08 4.224T4.768 26.08.576 16 4.768 5.888 14.88 1.696z"/>
						<path fill='#fff' d="M14.88 1.696 m7.136 16.064v-3.584h-5.344V8.832h-3.584v5.344H7.712v3.584h5.376v5.376h3.584V17.76h5.344z"></path>
					</svg>
				</button>

				<div>
					<div>${ this.$install0 }</div>
					<ul>
						<li>${ this.$install1 }</li>
						<li>${ this.$install2 }</li>
					</ul>
				</div>
			</section> 

			<footer flow='row left'>
				<a href='/' flow aria-label='home'><button id='btn-home' class='round ${app.UI_button_size_class}'>${ useSVG('home') }</button></a>
				<small>
					<div id='app-version'>${ app.version||'2021.X.X.A' }</div>
					<div class='one'>${this.$rights}</div>
					<a href="mailto:${this.$contact}">${this.$contact}</a>
				</small>
			</footer>
		</div>`
	}

	// we want the right side button of the header (fullscreen toggle) 
	// to match the (flexible) width of the top corner buttons of the app's header
	// for a balanced visual...
	setTopCornerWidth(){
		let w = app.q('.top-corner-wrapper')
		w && app.style.setProperty('--top-corner-width', w.clientWidth+'px')
	}

	afterResize(){ this.setTopCornerWidth() }
	afterFirstRender(){ this.setTopCornerWidth() } // init, resize is already done

	setLang( e){
		if( e.target.localName === 'button'){
			app.lang = e.target.textContent.toLowerCase()
		}
	}

	onConnected(){
		this.classList.add('menu')
		app.menu_options = this

		// to use in app's menuOptionsTemplate events callbacks 
		// b/c `this` will be this component, **NOT THE APP**
		this.app = app
		this.render()
	}

	onVolumeChange( value, target){
		app.global_volume = value / 100
	}

	toggleFullscreen( e){
		if( screenfull.isEnabled)
			screenfull.toggle()
		else
			log('err','screenfull not enabled')
		this.open = false
	}
}

MenuOptions.properties = {
	open: {
		value: false,
		class: 'open',
		watcher( val){
			app.opened_menu = val&&'options'||''
		}
	}
}

MenuOptions.strings = {
	fr: {
		install0: "Installer :", //!! no HTML, used in non-text binding (attr. aria-label)
		install1: "Raccourçis sur l'écran d'accueil",
		install2: "S'ouvre dans une fenêtre autonome",
		fullscreen: "Plein écran",
		rights: "© 2021 inc",
		contact: "ncode.fun@gmail.com",
		volume: "Sound volume level"
	},
	en: {
		install0: "Install:", //!! no HTML, used in non-text binding (attr. aria-label)
		install1: "Shortcut on home screen",
		install2: "Opens in its own window",
		fullscreen: "Fullscreen",
		volume: "Volume du son"
	}
}

define( 'menu-options', MenuOptions, ['inputs/range-slider'])