import { Component, html, define, log, unsafeHTML, useSVG } from '../vision-stage.js'
import { q } from '../modules/utils-core.js'

const app = q('vision-stage')

class MenuScenes extends Component {

	constructor(){
		super()

		this.initial_content = this.innerHTML
		let disabled_scenes = this.getAttribute('disabled-scenes')
		if( !disabled_scenes)
			this.disabled_scenes = []
		else if( disabled_scenes.includes(','))
			this.disabled_scenes = disabled_scenes.split(/\s*,\s*/)
		else
			this.disabled_scenes = disabled_scenes.split(/\s+/)

		this.admin_scenes = app.admin_scenes ?  app.admin_scenes : []
		this.non_admin_scenes = app.admin_scenes 
			? app.admin_scenes.filter( s => !this.admin_scenes.includes( s)) 
			: null
		//log('check', 'this.non_admin_scenes:', this.non_admin_scenes)
	}

	onConnected(){
		app.nav = app.menu_scenes = this
		this.onclick = this.onClick.bind( this)
		this.scene_param_index = this.getAttribute('scene-param-index')||0
		this.classList.add('menu')

		const scenes = []
		const strings_for_lang = this.strings[ app.lang] //!! or use default ?
		for( let str_key in strings_for_lang){
			//// we must know which strings are scenes; for now they're one char long, or have $ special prefix
			if( str_key.length === 1 || str_key.startsWith('$'))
				scenes.push( str_key.startsWith('$') ? str_key.slice(1) : str_key)
		}

		// show-for:scene
		let str = []
		if( scenes.length){
			str.push(`.app:not([scene]) [show-for\\:scene]`)
			//str.push(`.app[scene=''] [show-for\\:scene='any']`)
			str.push(`.app[scene=''] [show-for\\:scene]:not([show-for\\:scene=''])`)
			for( let name of scenes)
				str.push(`.app[scene='${name}'] [show-for\\:scene]:not([show-for\\:scene~='${name}'])`) 
				//:not([show-for\\:scene~='any'])
				//? => 'any' means hide if none (when scene not chosen yet, menu is open)... @todo: need better naming
			app.has_scenes = scenes.length > 1
			app.classList.remove('waiting-scenes')
			app.scenes = 
			this.scenes = 
				scenes.map( s => s.replace(/^\$/g,''))
			app.onScenes && app.onScenes( this.scenes)
			if( app.scene && !this.scenes.includes( app.scene) ){
				log('err', 'unknown scene:', app.scene, this.scenes)
				app.scene = this.scenes[0]
			}
			else {
				
				requestAnimationFrame( t => {
					if( !app.scene){ 
						const non_admin_scenes = this.non_admin_scenes || this.scenes
						if( app.default_scene !== undefined)
							app.scene = app.default_scene
						else if( non_admin_scenes.length > 1)
							this.open = true
						else /*if( this.scenes.length === 1)*/ // or create / use AUTO_SET_SCENE = 'A' ?
							app.scene = this.scenes[0]
					}
					else {
						app.scene = app.scene // trigger watcher / transformer
					}
				})
			}
		}

		str = str.join(',\n') + '{ display: none !important }'
		const stylesheet = document.createElement('style')
		stylesheet.classList.add('show-for-styles')
		stylesheet.textContent = str
		document.head.appendChild( stylesheet)

		this.render()
	}

	template(){
		if( !this.scenes || this.scenes.length < 2)
			return
		return this.scenes.map( s => 
			html`<button .scene=${ s } data-scene=${s}  ?disabled=${this.disabled_scenes.includes( s)}
				class='bare ${ s===app.scene ? 'selected':'' }' 
				show-for:role=${ this.admin_scenes.includes( s) ? 'admin' : ''}>
				${ this.getString( s) }
				${ useSVG('fanion','fanion layer', 'none', '0 -10 100 120') }
			</button>`
		)
	}

	onClick( e){
		//log('err', 'this.prevent_nav:', app.prevent_nav)
		//log('info', 'e.target.localName:', e.target.localName)
		if( app.prevent_nav){
			app.onNavPrevented && app.onNavPrevented()
			return
		}

		if( !this.open){
			this.open = true
			return
		}
		if( e.target.localName !== 'button'){
			this.open = false
			//alert('not a button: '+e.target.tagName)
			return
		}

		let scene = e.target.scene /// label
		//log('check', 'scene:', scene, 'app scene:', app.scene)
		if( scene && scene !== app.scene){ /// new scene
			app.scene = scene
			app.params[ this.scene_param_index] = scene
			
		}
		this.open = false
	}
}

MenuScenes.properties = {
	open: {
		value: false,
		class: 'open',
		/// classes: [['.app', 'menu-open']] // ?
		watcher( val){
			//log('check', 'scenes open:', val)
			app.opened_menu = val&&'scenes'||''
		}
	}
}

MenuScenes.strings = {

}

define( 'menu-scenes', MenuScenes)