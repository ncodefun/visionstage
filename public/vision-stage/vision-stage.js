const SCENE_HISTORY = true
const UPDATE_CHECK_MIN = 30
const LANDSCAPE_HEIGHT = 40 /// rem
const PORTRAIT_HEIGHT = 40
const FONT_SIZE_DECIMALS = 1
/// -> 10.2 px => makes total space vary a bit, but we get more even layout spacing (Browsers are BAD at this…)

const CLEAR_STORE = false  //! Warning: erase all app data...

import { html, svg, render as litRender } 
	from './modules/lit-html.js'
import { unsafeHTML } 
	from './modules/lit-html/directives/unsafe-html.js'
import { ifDefined } 
	from './modules/lit-html/directives/if-defined.js'

import log from './z-console.js' /// blackbox this file in chrome to get real line numbers
import { q, el, debounce, isObject, ctor, clone, loadStyleSheetAsync, objectFromString, containsHTML, nextFrame, cleanNum, chain  } from './modules/utils-core.js'

/// Share with others for easy imports from a single source
export { html, svg, unsafeHTML, ifDefined, log }
/// To deprecate, using q('vision-stage') is as easy... 
export const getStage = () => stage

/// Defines a custom element and return whenDefined's promise in one short call:
/// ``` define('my-comp').then( ...) ```
export async function define( tag_name, clss, components){
	//log('info', 'define:', tag_name)
	/// import js & css dependencies (requiered right from the start)
	
	if( components && components.length){
		components = components.map( c => Component.load( c))
		await Promise.all( components)
	}
	
	window.customElements.define( tag_name, clss)
	return window.customElements.whenDefined( tag_name).then( () => {
		if( tag_name.includes('app-main')){
			//log('pink', 'app defined:', tag_name)
			const app_el = q( tag_name)
			setTimeout( () => { 
				app_el.classList.add('loaded')
				q('#loading').classList.add('faded') 
				setTimeout( () => { q(':root > body > #loading').remove() }, 1000)
			}, 100)

			stage.resize()
			stage.updateForURL()
			setTimeout( e => 
				window.addEventListener('resize', debounce( stage.resize.bind( stage), 300, 300)), 
				// ->  debounce  (call once after events faster than this dly), 
				// ->  throttle  (call while events at this dly)
				2000
			)
		}
		// else {
		// 	log('info', 'comp defined:', tag_name)
		// }
	})
}

/// flags for logging different things (or not)
export const debug = {
	flow: false,
	uses: false, /// logs: <comp-a> will render when any of [...] on <comp-b> is set
	render: false, //['series-selector'],
	renders: false,
	load: false,
	store: false,
	history: false,
	params: false,
	bags: false,
	scenes: false
}

let stage, store, store_namespace
export const is_mac = navigator.platform === 'MacIntel'
const is_iOS = /iPad|iPhone|iPod/.test( navigator.platform) || 
							 (is_mac && navigator.maxTouchPoints > 1)
const is_safari = /^((?!chrome|android).)*safari/i.test( navigator.userAgent)
/// Will reference all components with an afterResize method to call them after window is resized
const resize_watchers = new Set()
const isScrollbarVisible = element => element.scrollHeight > element.clientHeight

export function useSVG( id, clss='', ar, vb='0 0 32 32'){
	let src = stage.app.icons_path || '/vision-stage-resources/images/icons.svg'
	//log('check', 'svg path:', src)
	return html`<svg class=${clss ? 'icon '+clss : 'icon'} viewBox=${vb} preserveAspectRatio=${ ifDefined( ar) }>
		<use href='${src}#${id}'/>
	</svg>`
}
const loaded_components = new Set()
/// Component base class to be extended by custom elements 
export class Component extends HTMLElement {

	constructor(){
		super()
		this._init()
		
		//if( this.localName==='menu-options') log('err', 'side menu strings?', this.strings)
		//// default; changing lang updates ALL components
		if( this.strings && this.localName !== 'vision-stage')
			this.uses([['vision-stage', 'lang']])
	}
	/** Just for consistency with AppComponent */
	connectedCallback(){ 
		this.onConnected && this.onConnected() 
	}

	_init(){
		//console.groupCollapsed('comp: '+ this.id||this.localName)
		//log('pink', 'INIT COMP:', this.id||this.localName)
		this._state = {}
		//this.initialized = true
		/// now it's a normal static property (no need to cache), directly in class body!
		/// use proto to "type cast" and avoid complaints of typeerror (ctor is a function; no .properties on it)
		const _ctor = ctor( this)
		let properties
		if( _ctor.properties && _ctor._properties){
			// log('err', 'HAS BOTH OWN AND INHERITED PROPS', 
			properties = Object.assign( {}, _ctor._properties, _ctor.properties)
		}
		else 
			properties = _ctor.properties || _ctor._properties

		/// to array of [key,val]
		//log('err','properties:',properties)
		let flat_properties = properties ? Object.entries( properties) : []
		for( let [prop, desc] of flat_properties){
			if( !isObject( desc)) /// wrap if primitive value
				desc = { value: desc }

			else if( desc.stored && !this.id && debug.store){
				log('warn', '--trying to store:', prop, '...but no id on element (for store); will use the tagName as the store key', '<'+this.tagName+'>','*** MAKE SURE THAT THIS ELEMENT IS ONLY USED ONCE ***')
				//throw Error('an element needs an id to be stored, tag:' + this.tagName)
			}
			let store_id = this.id||this.localName
			let stored_val = !!store_id ? storedValue( store_id, prop) : undefined
			if( stored_val !== undefined){
				//log('pink', 'stored val:', prop, stored_val, desc.stored)
				if( desc.stored)
					desc.value = stored_val
				else //! DELETE / CLEAN UP
					saveStore( store_id, prop, null, true)
			}
			else if( desc.stored){ //// store initial value
				//if( debug.store) 
				//log('info','--storing initial value:', store_id, prop, desc.value)
				saveStore( store_id, prop, desc.value)
			}

			if( desc.class){
				this.classList.toggle( desc.class, !!desc.value)
			}
			if( desc.attribute){ // ['open', 'bool']
				//!! wait for ctor to finish, else attr will be set to prop initial value before we read initial attr value
				requestAnimationFrame( t => {
					if( typeof desc.attribute === 'string'){
						this.setAttribute( desc.attribute, desc.value)
					}
					else { // Array
						let attr = desc.attribute[0]
						if( desc.attribute[1] === 'bool'){
							if( desc.value == true)
								this.setAttribute( attr, '')
							else
								this.removeAttribute( attr)
						}
						else // we shouldnt need this, use string instead
							this.setAttribute( attr, desc.value)
					}
				})
			}

			Object.defineProperty( this, prop, {
				get(){
					//log('warn','GET', prop, '=>', this['__'+prop] )
					//// can use a getter on desc for computed prop
					return desc.getter ? desc.getter.call( this, this._state[ prop]) : this._state[ prop] 
				},
				set( val){ /// SET:
					// if( prop==='scene')
					// if( prop==='suit')
					// 	log('pink', 'prop:', prop, 'val:', val)
					//log(this.__name)
					//if( prop === 'active_section') deb ugger
					//--this.constructor.properties
					let store_id = this.id||this.localName
					if( !store_id) debugger
					if( prop in properties){ //// in? ==> is a reactive prop 

						let prev_val = this._state[ prop]
						if( desc.transformer && !this.bypass_transformer)
							val = desc.transformer.call( this, val, prev_val, desc.value, stored_val)

						if( desc.stored){
							/// throttled_saveStore will only be fired once – though it may be called with different params... 
							/// like rx and ry during a continuous dragging, then only one of them would be stored in the end
							//+ so store value directly and leave the global localstorage saving for the throttled callback
							store[ store_id] = store[ store_id] || {}
							store[ store_id][ prop] = val
							throttled_saveStore() /// global store (will be called at least once after multiple)
						}
						
						this._state[ prop] = val

						if( !this.block_watchers)
							desc.watcher && desc.watcher.call( this, val, prev_val)
						
						if( desc.attribute){ /// ['open', 'bool']
							if( typeof desc.attribute === 'string'){
								//log('pink', 'attribute:', desc.attribute, val)
								this.setAttribute( desc.attribute, val)
							}
							else { /// Array
								let attr = desc.attribute[0]
								if( desc.attribute[1] === 'bool'){
									if( val == true)
										this.setAttribute( attr, '')
									else
										this.removeAttribute( attr)
								}
								else
									this.setAttribute( attr, val)
							}
						}

						if( desc.class){
							this.classList.toggle( desc.class, !!val)
						}

						// if( prop==='scene' && stage.app.scene)
						// 	log('err', 'message:', stage.app.menu_scenes)
						if( prop==='scene' && stage.app.scene && stage.app.scene !== stage.app.params[0] && stage.app.menu_scenes.scenes.length>1){

							const p = location.pathname + '#'+stage.app.scene
							//stage.app.path === '/' ? '/' : '/'+stage.app.path+'/'+stage.app.scene
							/// replace if there were no scene to avoid comming back to no scene & no menu
							/// then we'd have to detect and reopen menu => useless	
							if( SCENE_HISTORY && prev_val){ 
								if( p !== location.pathname){
									//log('warn', 'PUSH history with:', p)
									history.pushState( null, '', p)
								}
								//else log('warn', 'wont push history, same path')
							}
							else {
								//log('warn', 'REPLACE history with:', p)
								history.replaceState( null, '', p)
							}
						}

						this.render()
						//if( debug.renders && this.renders) 
							//log('err','this, renders:', prop, this.renders, this.renders.get( prop))

						/// take care of dependencies ( this.uses([target,propA,propB]) )
						if( this.renders && this.renders.has( prop)){
							requestAnimationFrame( e => {
								for( let render_target of this.renders.get( prop)){
									if( debug.renders) log('check', 'prop, render target:', prop, render_target)
									render_target.render()
								}
							})
						}
					}
					else {
						log('err','NO own prop on this:', prop, properties)
					}
				}
			})

			const v = 
				stored_val || desc.value
			if( desc.init_watcher)
				this[ prop] = v
			else {/// init "silently": no watcher/transformer etc...
				this._state[ prop] = v
				//prop==='scene' && log('err', 'scene; stored_val , desc.value:', stored_val , desc.value)
			}
		}

		if( !stage){ ///! == this comp is stage itself: ain't finished being created...
			stage = this //// when comp is vision-stage , use `this` 
		}
		// log('err', 'stage app:', stage.app)
		// const app_langs = stage.app && stage.app === this && this.getAttribute('langs')
		// app_langs && log('pink', 'app_langs:', app_langs)

		if( stage === this){ /// we need langs now for stage strings, overwrite later if app_langs
			stage.langs = (q('app-main')||q('my-app-main')).getAttribute('langs').split(/\s*,\s/)
			stage.buildCSSForLangs()
		}

		// else if( app_langs || stage.app === this){
		// 	
		// 	/// overwrite
		// 	if( app_langs){
		// 		stage.langs = app_langs.split(/\s*,\s/)
		// 	}
		// 	if( !stage.langs.includes( stage.lang)){ 
		// 		log('err','lang not in langs?', stage.lang, '->', stage.langs)
		// 		stage.lang = stage.langs[0]
		// 	}
		// }

		/// combine attribs and static strings

		const strings = (_ctor.strings ? clone( _ctor.strings) : {})
		
		if( _ctor._strings){
			for( let l in _ctor._strings){
				strings[ l] = strings[ l] || {}
				Object.assign( strings[ l], _ctor._strings[ l])
			}
		}
		
		let no_strings = !_ctor.strings 

		/// => {fr: {k:v,...}, en: {k:v,...}, ...}
		//// get attribs string
		for( let name of this.getAttributeNames()){
			if( name.startsWith('strings')){
				no_strings = false
				let lang = name.includes(':') ? name.split(':')[1] : undefined //app.langs[0]
				let values = objectFromString( this.getAttribute( name))
				//log('purple', 'got strings from attr:', values)
				//! this.removeAttribute( name) 

				if( lang==='*' || !lang){ //// all : define first if others: need to be overriden with specific langs
					/// assign same values to all languages
					for( let l of stage.langs){
						strings[ l] = strings[ l] || {}
						Object.assign( strings[ l], values)
					}
				}
				else {
					if( !strings[ lang]) 
						strings[ lang] = {}
					Object.assign( strings[ lang], values)
				}
				this.removeAttribute( name)
			}
			else if( name.startsWith('string:')){
				let str_name = name.split(':')[1]
				let val = objectFromString( this.getAttribute( name)) /// { fr: ..., en: ... }
				for( let k in val){
					strings[ k] = strings[ k] || {}
					strings[ k][ str_name] = val[ k]
				}
				this.removeAttribute( name)
			}
		}

		if( !no_strings){

			if( !stage.langs){
				log('err', 'no stage langs yet', this)
			}
			this.strings = strings
			/// get / set string
			//// the default lang obj should contains all strings keys; others might miss some
			let default_lang_strings = strings[ stage.langs[0]]
			if( default_lang_strings){ /// if we have strings KEYS, store each as this.$str 
				for( let name of Object.keys( default_lang_strings)){
					Object.defineProperty( this, '$'+name.replace(/-/g,'_'), {
						get(){
							return this.getString( name)
						},
						set(){ throw 'cannot set a string' }
					})
				}
			}
		}

		// if( _ctor.use s) // static
		// 	this.use s( _ctor.use s)

		if( this.afterResize && !resize_watchers.has( this)){
			resize_watchers.add( this)
			//log('check', 'resize_watchers	:', resize_watchers)
		}

		if( _ctor.attributes){
			for( let attr of _ctor.attributes){
				this[ attr] = this.getAttribute( attr)
			}
		}

		if( _ctor.sounds)
			stage.sounds_list = _ctor.sounds

		//log('ok', 'comp props defined', this.localName)
	}

	///  ->  When these [[comp, ...props]] changes, also render me – 
	uses( entries){
		// log('pink', 'this, uses:', this, entries)
		//// 
		//// -> for each target:  target.renders = Map([['prop1', Set.add(this)],[prop2, Set.add(this)]])
		//// 											app.renders = Map([['lang', ADD this]])
		for( let entry of entries){
			/// non destructive...
			let prop_holder = entry[0]
			let props = entry.slice(1) /// copy the rest
			// if( props.length > 1) /// 1 => only lang
			//! @TODO only `uses` lang when a comp actually uses lang 
			//! -> check for: 1. [lang] attr and 2. strings is not empty
			if( debug.uses && props.length){
				log('info', '<'+(this.id||this.tagName+'::'+this.className)+'>', 'will render when any of [',...props,'] on', '<'+prop_holder+'>', 'is set')
			}
			
			if( typeof prop_holder === 'string'){
				let prop_holder_selector = prop_holder
				prop_holder = q( prop_holder_selector) 
				if( !prop_holder)
					throw 'uses(); prop_holder do not exist (yet?): ' + prop_holder_selector
					//debugger
			}
			if( !prop_holder) {
				log('err', 'no prop holder, entry:', entry)
				log('info', '<'+(this.id||this.tagName+'::'+this.className)+'>', 'will render when any of [',...props,'] on', '<'+prop_holder+'>', 'is set')
				debugger
			}			
			prop_holder.renders = prop_holder.renders || new Map()

			for( let prop of props){

				if( prop_holder.renders.has( prop)) /// value exist (Set of render targets)
					prop_holder.renders.get( prop).add( this)
				else
					prop_holder.renders.set( prop, new Set([this]))
			}
		}
	}

	/** set an attribute and render this */
	attr( name, value){
		this.setAttribute( name, value)
		this.render()
	}

	async render( evt_ctx){

		if( !this.template){
			if( this.localName !== 'vision-stage')
				log('warn', '--no template, cannot render(): '+ this.id +', '+ this.tagName)
			return
		}

		const debugging = debug.render===true || 
			Array.isArray( debug.render) && debug.render.includes( this.id||this.classList[0])
		if( !this.needsRender){
			this.needsRender = true
			await nextFrame()
			this.needsRender = false
			const tmpl = this.template() 
			//! => we might return null if something is missing for rendering the template
			if( !tmpl){ // === null){
				if( debugging) 
					log('err', '--tmpl: no value -> no render', this.id, this.localName)
				return
			}

			!this.rendered && this.beforeFirstRender && this.beforeFirstRender()
			if( debugging)
				log('gold','--GOT TMPL, RENDER ', this.localName, (this.id||this.classList[0]))

			//log('warn', 'eventContext: this:', this)
			litRender( tmpl, this, {
				scopeName: this.localName, 
				eventContext: evt_ctx || this.event_context || this
			})
			
			const has_been_rendered = this.rendered
			this.rendered = true //! BEFORE CALLBACK TO PREVENT IFINITE LOOP
			if( !has_been_rendered){
				this._afterFirstRender && this._afterFirstRender()
				this.afterFirstRender && this.afterFirstRender()

				if( this.skipped_afterResize){
					this.skipped_afterResize = false
					this.afterResize( stage.REM)
				}
				//-- delete this.afterFirstRender 
				/// -> IT'S SUPPOSEDLY BETTER NOT TO DELETE ANYTHING AFTER AN OBJECT DEFINITION
			}
			this._afterRender && this._afterRender()
			this.afterRender && this.afterRender()
		}
		else if( debugging) 
			log('gold','already needsRender, waiting:', this.localName, (this.id||this.classList[0]))
	}

	q( sel){
		return this.querySelector( sel)
	}
	/** query elements and transform to an array */
	qAll( sel){
		return Array.from( this.querySelectorAll( sel))
	}

	/**
	 * !! warning: will return result of unsafeHTML if contains HTML, 
	 * !! use raw=true argument if needed raw string to use outside a template (like with prop binding or directly setting .innerHTML)
	 * Will look for strings on 
	 * @str_name the key for the requested string
	 * @return the string corresponding to the actual language
	 */
	getString( str_name, raw=false){
		//log('err','string() name:', str_name)
		if( !str_name) return
		let lang = (stage || this).lang
		let strings_for_lang = this.strings[ lang]
		let str = strings_for_lang && strings_for_lang[ str_name]

		if( !str){ /// try special prefix for scenes '$'
			str = strings_for_lang && strings_for_lang[ '$'+str_name]
		}

		//// try with default lang
		if( !str){
			strings_for_lang = this.strings[ stage.langs[0]] /// try to use the default lang (first)
			str = strings_for_lang && strings_for_lang[ str_name] 
			//log('warn', 'no string for lang; got the default:', str_name, '→', str)
		}
		
		if( !str){
			log('warn','NO STRING FOUND FOR:', str_name)//, 'for:', this)
			//log('warn','--strings',this.strings)
			//debugger
			return ''
		}
		//log('info', 'str:', str_name, str )

		return raw ? str : (
			containsHTML( str) ? 
				unsafeHTML( str) :
			str.startsWith('>') ? /// EXPLICITLY DECLARED AS HTML
				unsafeHTML( str.slice(1)) : 
				str
		)
	}

	static async load( file_path, scripts){
		if( debug.load)
			log('ok','load() file_path:', file_path)
		
		/// first check if already loaded
		if( loaded_components.has( file_path)){
			//log('info', 'component already loaded:', file_path)
			return
		}
		else
			loaded_components.add( file_path)

		/*if( scripts){
			scripts = scripts.split(/\s*,?\s/)
				.map( src => loadScriptAsync( src.includes('/') ? src : `/scripts/${src}`))
			await Promise.all( scripts)
		}*/

		let js, css
    if (Array.isArray( file_path)){
      js = file_path[0] + '.js'
      css = file_path[1] + '.css'
    }
    else if (file_path.endsWith('.js')){
      js = file_path
    } 
    else {
      js = file_path + '.js'
      css = file_path + '.css'
    }
		//log('check', 'css:', css)
		/// if starts with / or ./ leave as is, else assume is in /vision-stage/components/
		if( ! /^\.?\//.test( css))
			css = `/vision-stage/components/${ css }`
		else 
			css = location.pathname + css

		if( !/^\.?\//.test( js))
			js = `/vision-stage/components/${ js }`
		else
			js = location.pathname + js

		//log('check', 'js,css:', js, css)
		/// make sure CSS is loaded before we import js so no flash of unstyled components
		css && await loadStyleSheetAsync( css)
		return import( js)
		// .then( () => {
		// 	if( file_path.startsWith('app-')){
		// 	}
		// 	return 'ok'
		// 	/// return ?
		// })


		/// syntax if need specific import objects 
		/// (for now app/comp modules do not need to export anything, they just define and register their element)
		/// ( { default: comp, other } = await import(`...`) )
		/// return comp
	}
}

/// APPS BASE CLASS
export class AppComponent extends Component {

	constructor(){
		super()
		//this.authentified = false // adds class .auth
		// disable right-clicking
		//!this.addEventListener( 'contextmenu', e => e.preventDefault())
		this.UI_button_size_class = 'medium UI'
		this.stage = this.parentElement
		this.lang = this.stage.lang
		this.classList.add('app', 'waiting-scenes')
		if( !this.hasAttribute('no-scroll'))
			this.classList.add('scroll')

		if( !this.access_level)
			this.access_level = 1 /// DEFAULT; NEEDS TO BE AUTHENTIFIED

		//this.uses([['#app','portrait']]) /// renders if in portrait some parts are 'moved' in menu
		
		//// Selectors
		/// We can open multiple selectors, but as soon as we click outside a selector they all close
		this.open_selectors = new Set()
		this.addEventListener('mousedown', e => {
			const btn = e.target.closest('metacore-selector')
			if( this.open_selectors.has( btn)) return /// clicked opened, will close itself
			for( let sel of this.open_selectors)
				sel.toggleOpen( false)
		})
		
		this._closeOpenedMenu = this.closeOpenedMenu.bind( this)

		let icons_path = this.getAttribute('icons')
		if( icons_path){
			this.icons_path = icons_path
		}
	}

	/// -> use onConnected for extending apps, or put super.connectedCallback()
	connectedCallback(){

		//this.params = stage.url_segments.length>1 && stage.url_segments.slice(1) || []
		//log('ok', 'App connected ')//-> params:', ...this.params)
		this.onConnected && this.onConnected() /// -> before setting scene
		document.title = this.$doc_title
		//q("meta[name='description']").setAttribute('content', this.getAttribute('description'))
		//log('prod', 'Vision Stage')
		
	}

	//!! must be called from the app after user event, or onConnected but then the first time it won't play on iOS
	setupSounds(){
		const sounds_data = ctor( this).sounds
		if( !sounds_data)
			return

		this.sounds = {}
		window.AudioContext = window.AudioContext || window.webkitAudioContext
		this.audio_context = new window.AudioContext() ///
		this.gain_node = this.audio_context.createGain() /// global volume control
		if( is_iOS || is_safari){
			return Promise.all( 
				sounds_data.map( ([name, url, options={}]) => fetch( url)
					.then( response => response.arrayBuffer())
					.then( array_buffer => {
						this.audio_context.decodeAudioData( array_buffer, audio_buffer => {
							this.sounds[ name] = { audio_buffer, options }
						})
						return 'success'
					})
				)
			)
		}
		else
			return Promise.all( 
				sounds_data.map( ([name, url, options={}]) => fetch( url)
					.then( response => response.arrayBuffer())
					.then( array_buffer => this.audio_context.decodeAudioData( array_buffer))
					.then( audio_buffer => this.sounds[ name] = { audio_buffer, options })
					.catch( err => log('err',err))
				)
			)
	}

	playSound( name){
		if( !this.sounds[ name]){
			log('err', 'no sound with name:', name, 'check if sounds are set up')
			return
		}

		const { audio_buffer, options } = this.sounds[ name]
		//log('info', 'playSound:', name, options.volume)
		const source = this.audio_context.createBufferSource()
		source.buffer = audio_buffer
		this.gain_node.gain.value = this.global_volume * (options.volume || 1)
		source.connect( this.gain_node).connect( this.audio_context.destination)
		this.playing_source = source

		if( options.delay)
			setTimeout( e => {
				source.start()
			}, options.delay)
		else 
			source.start()
	}

	stopSound( name){
		//log('err', 'stop:', this.playing_source)
		if( this.playing_source){
			this.playing_source.stop()
			this.playing_source = null
		}
	}

	setLevel( e){
		const lvl = e.currentTarget.level
		log('prod', 'setLevel:', lvl||e.currentTarget)
		if( lvl !== this.level || this.allow_level_reset)
			this.level = lvl
	}

	_afterFirstRender(){
		const bright_veil = el('div','',{ id:'bright-veil', class: 'veil menu-veil layer' })
		const dark_veil = el('div','',{ id:'dark-veil', class: 'veil layer' })
		bright_veil.addEventListener('mousedown', this._closeOpenedMenu)
		this.append( bright_veil, dark_veil)

		if( !this.menu_scenes)
			this.classList.remove('waiting-scenes')
	}

	toggleMenuScenes(){
		//log('err','--toggleMenu; prevent nav:', !!this.prevent_nav)
		if( this.prevent_nav)
			this.onNavPrevented && this.onNavPrevented()

		if( !this.scene || !this.menu_scenes || this.menu_scenes.scenes.length<2 || this.prevent_nav) 
			return
			
		this.menu_scenes.open = !this.menu_scenes.open
	}

	closeOpenedMenu(){
		//log('pink', 'close?', )
		if( this.scene && this.menu_scenes && this.menu_scenes.open)
			this.menu_scenes.open = false
		else if( this.menu_options && this.menu_options.open)
			this.menu_options.open = false
		else if( this.menu_auth && this.menu_auth.open && this.menu_auth.user)
			this.menu_auth.open = false
	}

	toggleMenuOptionsOpen( e){
		this.menu_options.open = !this.menu_options.open
	}
	toggleMenuAuthOpen( e){
		if( this.authentified)
			this.menu_auth.open = !this.menu_auth.open
	}
	/** TO OVERRIDE */
	afterSceneChange(){

	}
}

/** These will be extended, use underscore to mix with user's own */
AppComponent._properties = { 
	authentified: { // set by menu-auth
		value: false,
		class: 'auth',
		// watcher(val){
		// 	log('prod', 'auth:', val)
		// }
	},
	faded: {
		value: true,
		class: 'faded'
	},
	opened_menu: {
		value: '',
		attribute: 'opened-menu',
		watcher( val, prev){
			//log('check', 'opened-menu:', val)
			//if( !val) debugger
			if( !this.scene && prev==='auth'&& !val && this.default_scene!==''){
				this.menu_scenes && setTimeout( e => {
					this.menu_scenes.open = true
				}, 500)
			}
		}
	},
	menu_options: null,
	menu_auth: null,
	global_volume: { 
		value:.6, 
		stored:true 
	}, //// this in menu == shown _page == this
	// logo: {
	// 	value: null,
	// 	getter(){
	// 		let path = '/vision-stage-resources/images/apps-posters/'+this._state.logo
	// 		if( !path.endsWith('.png')) path += '.png'
	// 		return path
	// 	}
	// },
	scenes: null,
	scene: {
		value: null, /// {}
		stored: false, //!! depends on url, should not override...
		watcher( val, prev){
			this.setAttribute('scene', val)
			//console.clear()
			this.afterSceneChange && this.afterSceneChange( val, prev)
		},
		transformer( val, prev){
			//debugger
			// val && log('info', 'scene:', val)
			const restricted = chain( this.restrictions, val, 0)
			//this.restrictions?.[ val]?.[ 0]
			if( val && restricted === true){
				log('warn', 'restricted scene:', val)
				return prev
			}
			return val
		}
	},
	level: {
		value: 1,
		attribute: 'level',
		watcher( val){
			//log('check', 'level:', val)
			//this.setAttribute('level', val)
			this.afterLevelChange && this.afterLevelChange( val)
		}
	},
	admin: {
		value: false
	},
	allowed: {
		value: true, /// will be set later if we use menu-auth depending on if user_data permits it
		// watcher( val){
		// 	if( val) alert ('NOW ALLOWED')
		// }
	}
}

AppComponent._strings = {
	fr: {
		
	},
	en: {
		
	}
}

let active_sw, redundant

///   THIS IS THE STAGE / MASTER COMPONENT - contains apps, hosts global props and methods)   ///
class VisionStage extends Component {

	constructor(){
		const main = q('app-main') || q('my-app-main')
		const ns = main.getAttribute('store')
		initStore( ns )
		super() /// needs store to be init

		this.app_name = ns.replace('defimath-','').toLowerCase()
		//log('warn', 'app name:', this.app_name)
		this.is_iOS = is_iOS

		//!!
		// this.getActiveSW().then( SW => {
		// 	active_sw = SW || null
		// })

		this._onInstallable = this.onInstallable.bind( this)
		this._onClickInstall = this.onClickInstall.bind( this)
		window.addEventListener('beforeinstallprompt', this._onInstallable)
		window.addEventListener('popstate', () => this.updateForURL( true))

		if( !CLEAR_STORE){
			const termination_event = 'onpagehide' in self ? 'pagehide' : 'unload';
			window.addEventListener( termination_event, e => saveStore())
		}

		document.body.addEventListener('mousedown', () => {
			document.body.classList.add('using-mouse')
		})
		document.body.addEventListener('keydown', () => {
			document.body.classList.remove('using-mouse')
		})

		const LH = this.getAttribute('landscape-height')
		const PH = this.getAttribute('portrait-height')
		this.landscape_height = LH && parseInt( LH) || LANDSCAPE_HEIGHT
		this.portrait_height = PH && parseInt( PH) || PORTRAIT_HEIGHT
		this.classList.add('stage')
	}

	buildCSSForLangs(){
		//// build CSS to hide elements with a lang attribute not matching the app's lang ATTR
		let str = ''
		for( let lang of this.langs)
			str += `html[lang='${lang}'] *[lang]:not([lang='${lang}']) { display: none !important }\n`
		const stylesheet = document.createElement('style')
		stylesheet.textContent = str
	  document.head.appendChild( stylesheet)
	}

	connectedCallback(){
		this.app = this.q('app-main') || this.q('my-app-main')
		this.url_segments = location.pathname.split('/').filter( item => item!=='').map( item => decodeURI( item))
	}

	resize(){
		const root = document.documentElement
		const FSD = this.font_size_decimals || FONT_SIZE_DECIMALS
		//log('check', 'FSD:', FSD)
		let ASPECT_RATIOS
		const c = ctor( this.app)
		//log('warn', 'c.aspect_ratios_v2:', c.aspect_ratios_v2)
		//log('err', 'aspect_ratios:', c.aspect_ratios)
		if( c.aspect_ratios_v2){
			const ratios = c.aspect_ratios_v2;
			//log('info', 'ratios:', ratios)
			ASPECT_RATIOS = {
				threshold: ratios.threshold,
				portrait: ratios.portrait && {
					ultra_tall: ratios.portrait['min'],
					tall: ratios.portrait['min-content'],
					base: ratios.portrait['base-content'] || ratios.portrait['max'],
					wide: ratios.portrait['max'] || ratios.portrait['base-content'],
				},
				landscape: {
					base: ratios.landscape['min'],
					wide: ratios.landscape['max-content'],
					ultra_wide: ratios.landscape['max'],
				},
				cross_margin: ratios.cross_margin||0,
				landscape_cross_margin: ratios.landscape_cross_margin||0,
				ultra_wide_cross_margin: ratios.ultrawide_cross_margin||0,
			}
		}
		else {
			ASPECT_RATIOS = c.aspect_ratios
		}

		const threshold = ASPECT_RATIOS.threshold

		let w = window.innerWidth,
				h = window.innerHeight
		const AR = { now: parseFloat( cleanNum( w / h)), min: 0 }
		
		const is_portrait = AR.now < threshold
		if( this.portrait !== is_portrait) /// ? only set if different; causes render EACH TIME (A LOT)
			this.portrait = is_portrait

		/// defines what relative height we want (in rem)
		let height_rem = this.portrait ? 
			this.portrait_height : 
			this.landscape_height

		/// We need three values SUB, MIN & MAX
		
		if( this.portrait && ASPECT_RATIOS.portrait){
			AR.sub = ASPECT_RATIOS.portrait.ultra_tall /// STAGE TALLEST
			AR.min = ASPECT_RATIOS.portrait.base /// CONTENT NARROWEST
			AR.max = ASPECT_RATIOS.portrait.wide /// STAGE WIDEST
		}
		else {
			AR.sub = 
			AR.min = ASPECT_RATIOS.landscape.base	/// STAGE NARROWEST
			AR.max = ASPECT_RATIOS.landscape.ultra_wide /// STAGE WIDEST
		}
		//log('info', 'AR sub, min, max:', AR.sub, AR.min, AR.max)
		this.style.setProperty('--stage-ar-for-widest-content', ASPECT_RATIOS.landscape.wide) /// CONTENT WIDEST 
		ASPECT_RATIOS.portrait &&
		this.style.setProperty('--stage-ar-for-tallest-content', ASPECT_RATIOS.portrait.tall) /// CONTENT TALLEST

		let margin = 0, above_ultra_wide = AR.now > AR.max, below_land_base = AR.now < AR.min

		if( this.portrait){
			if( ASPECT_RATIOS.cross_margin && AR.now > AR.max) // just below threshold, side black bars
				margin = ASPECT_RATIOS.cross_margin
		}
		else { // landscape
			margin = 
				(above_ultra_wide || below_land_base) &&
					(ASPECT_RATIOS.cross_margin || ASPECT_RATIOS.landscape_cross_margin) ||
				above_ultra_wide &&
					ASPECT_RATIOS.ultra_wide_cross_margin ||
					0
		}

		if( typeof margin === 'string')
			margin = parseFloat(margin) * h / 100
	
		/// Adjust size for margin
		if( AR.now > AR.max){
			if( margin) 
				h -= (margin * 2) /// scale stage to adjust for margin
			w = Math.floor( h * AR.max) /// smallest of: window width or max AR
		}
		else if( AR.min && AR.now < (AR.min||AR.sub)){
			if( margin)
				w -= margin * 2
			if( this.margin)
				h -= margin * 2
			const MIN_AR = 1 / (!this.portrait && AR.min || AR.sub)
			h = Math.floor( Math.min( w * MIN_AR, h)) /// smallest of: window height (h) or base AR
		}
		else if( this.margin){
			w -= margin * 2
			h -= margin * 2
		}
		this.classList.toggle('has-margins', !!margin)

		this.sth = h
		this.stw = w

		this.AR = w/h
		/// limit stage's height based on portrait's min AR
		const base_h = !this.portrait ? h : Math.min( h, w * (1/AR.min))
		root.style.setProperty('--stw',w+'px')
		root.style.setProperty('--sth',h+'px')
		root.style.fontSize = 
			(Math.floor( base_h / height_rem * 10**FSD) / 10**FSD) + 'px'
			/// -> floor else we might overflow and get scrollbar
		//log('info', 'fontSize :', root.style.fontSize)
		/// VALUE OF ONE REM IN PX (0.00)
		this.REM = Math.round((base_h / height_rem) * 100) / 100
		//log('check', 'resize_watchers:', ...resize_watchers)
		for( let comp of resize_watchers){ /// components with afterResize method
			//log('check', 'call resize for comp? :', comp)
			if( comp.rendered){ comp.afterResize( this.REM, AR.now) } 
			else { 
				//log('warn', 'skipped afterResize', this)
				comp.skipped_afterResize = true
			}
		}
		/// WE MIGHT WANT TO STYLE THE STAGE DIFFERENTLY WHEN THERE'S A SCROLLBAR 
		/// e.g. BY DEFAULT WE USE ROUNDED CORNERS WHEN WE SET A MARGIN / CROSS-MARGIN ATTR ON <vision-stage>, BUT IT BECOME "UGLY" WITH A SCROLLBAR, SO WE REMOVE ROUNDED CORNERS THEN…
		if( isScrollbarVisible( stage.app))
			document.body.classList.add('has-scrollbar')
	}
	
	async testToast(){
		//log('purple', 'testToast()')
		let answer = await this.toast.setMessage('HELLO WORLD!', ['World!!','OK'])
		//log('ok','answer', answer)
	}

	updateForURL( pop=false){
		// if( pop) log('check', 'pop state')
		// else log('ok', 'no pop, start updateURL')
		//this.url_segments = location.pathname.split('/').filter( item => item!=='').map( item => decodeURI( item))
		this.app.params = location.hash.slice(1).split('/')
		//log('err', 'updateForURL, this.app.params:', this.app.params)
		//this.url_segments.length>1 && this.url_segments.slice(1) || [];
		//this.app.params.length && log('info', 'params:', ...this.app.params)

		//// scene from first param
		let s = decodeURI( this.app.params[0])
		//log('check', 'scene from param:', s)
		if( !pop)
			this.app._state.scene = s || '' // we might not be ready to render; set on _state to bypass auto render
		else
			this.app.scene = s

		//// level from second param
		let l = this.app.params[1]
		if( l){
			l = parseInt( l)
			if( !isNaN( (l)))
				this.app._state.level = l
		}
		//log('check', 'l:', l)
	}
	/*
	//! erase SW
	async getActiveSW(){
		log('err', 'getActiceSW()', )
		if( 'serviceWorker' in navigator){ /// remote debug is not https, would throw 
			const registrations = await navigator.serviceWorker.getRegistrations()
			for ( let registration of registrations){
					registration.unregister()
					// .then( () => {
					// 	alert ('SW unregistered')
					// })
					//return null
				// }
				//return registration.active /// only first, should not be more
			}
		}
	}*/

	registerSW(){
		//log('info', 'this.registerSW()')
		if ('serviceWorker' in navigator)
		navigator.serviceWorker.register('/sw.js')
			.then( reg => {
				log('info',"Service Worker Registered")
				reg.onupdatefound = () => {
					//log('ok', 'SW update found')
					let installing_worker = reg.installing
					installing_worker.onstatechange = async () => {
						log('ok', 'SW State: ', installing_worker.state)
						switch( installing_worker.state){
							case 'installed':
								// WAIT FOR A POSSIBLE "REDUNDANT" STATE
								// CHROME MOBILE MAY BYPASS CACHE REFRESH ?
								setTimeout( () => {
									//! navigator.serviceWorker.controller is unreliable when calling update manually
									if( !active_sw && !redundant){
										// log('info', 'App is now available offline')
										this.classList.add('cached')
										this.toast.setMessage( this.$cached, ['OK', this.$install_standalone])
											.then( answer => {
												this.toast.show = false
												if( answer === 1 && this.deferredPrompt)
													this.onClickInstall()
											})
									}
									else {
										/// LONG RUNNING NETWORK CONNECTION (LIKE FIREBASE FIRESTORE) MAY PREVENT ACTIVATION FOR A WHILE; LOG TO KNOW
										log('info', 'SW Update is available, waiting for activation…')
									}
								}, 200)
								break

							case 'activated':
								/// IF NOT FIRST INSTALL, SHOW UPDATE READY: PLEASE REFRESH | LATER
								if( active_sw || redundant) 
									this.toast.setMessage( this.$update_ready, [this.$later, this.$refresh])
										.then( answer => {
											if( answer === 0)
												this.toast.show = false
											else
												location.reload()
										})
								break

							case 'redundant':
								redundant = true
								break
						}
					}
				}
				
				/// CHECK FOR UPDATE ONCE IN A WHILE TO NOTIFY A USER USING THE APP FOR A LONG TIME 
				/// (OR WHO KEEP THE TAB OPEN, NEVER REFRESHING)
				setInterval( () => { 
					log('ok', 'checking for service worker update...')
					reg.update() 
				}, 1000 * 60 * UPDATE_CHECK_MIN)
			})
		// else if( is_IOS)
		// 	alert ('Offline service unsupported… 🥺  — Apple wants you to use Safari, for your own good! 😩')
	}

	async onInstallable( e){
		e.preventDefault()
		this.deferredPrompt = e
		log('info','Is installable')
		this.classList.add('installable') /// use to show install shortcut/standalone button
	}

	/** user want a shortcut, trigger native prompt */
	onClickInstall( e){
		if( !this.deferredPrompt){
			log('err','no deferredPrompt', this)
			return
		}
		//this.menu.open = false
		this.deferredPrompt.prompt() /// native prompt
		this.deferredPrompt.userChoice
			.then( choiceResult => {
				if( choiceResult.outcome === 'accepted'){
					this.classList.remove('installable') /// hides install section in menu
				} 
				/// else user dismissed prompt
				this.deferredPrompt = null
			})
	}

	// confirmInstalled(){
	// 	//// will resolve to the answer's index
	// 	return this.toast.setMessage("<div><img class='logo' src='/vision-stage-resources/images/app-icons/android-chrome-192x192.png'><h2 style='font-size:1.75rem'>🎉 Installé&thinsp;! 🎉</h2><sup>(&thinsp;disponible hors-ligne&thinsp;)</sup><p>Ajouter un raccourçis sur le bureau ouvrira l'application dans sa propre fenêtre.</p>",	['Créer un raccourçis','Non merci'])
	// }
}

VisionStage.properties = {
	title: '',
	lang: {
		value: navigator.language.slice(0,2),
		stored: true,
		watcher( val, prev){
			let [lang, country] = navigator.language.split('-')
			this.country = country
			document.documentElement.setAttribute('lang', val + '-' + country) /// set complete code for speak
			//log('info', 'lang, country:', lang, country)
			if( this.app) this.app.lang = val // more intuitive to use app.lang
			//log('pink', 'app:', this.app)
		},
		init_watcher: true
	},
	portrait: {
		value: false,
		class: 'portrait'
	},
	dark_mode: {
		value: false,
		stored: true,
		class: 'dark-mode'
	}
}

VisionStage.strings = {
	fr: {
		cached: "🌟 Appli installée&thinsp;! 🌟<br><small>Vous pouvez maintenant l'utiliser hors-ligne<br><i>(&#8239;gardez le Wi-Fi ou l'Ethernet de cet appareil activé&#8239;)</i></small>",
		update_ready: "🌟 Une mise à jour est prête 🌟<br><small>Veuillez rafraîchir la page.</small>",
		refresh: "Rafraîchir",
		later: "Plus tard",
		dark_mode: "Mode sombre",
	},
	en: {
		cached: "🌟 App is installed&hairsp;! 🌟<div class='message'>You can now use it offline<br><i>(&#8239;keep your device's Wi-Fi or Ethernet activated&#8239;)</i></div>", //🥳
		update_ready: "🌟 An update is ready 🌟<div>Please refresh the page.</div>",
		refresh: "Refresh",
		later: "Later",
		install_standalone: "Standalone window<small>Will install a shortcut</small>",
		dark_mode: "Dark Mode"
	}
}

/** Parse store from localStorge or init a new one */
function initStore( ns){
	store_namespace = ns
	if( !ns){
		log('err', 'no store namespace');
		return
	}

	if( CLEAR_STORE){
		log('err','--CLEAR_STORE')
		store = {}
		localStorage.setItem( store_namespace, "{}")
		return
	}

	let stored_data = localStorage.getItem( ns);
	//log('ok','RAW:', stored_data)
	if( stored_data){
		try { store = JSON.parse( stored_data); } 
		catch( err){ 
			log('err','JSON parse error') 
			log('warn', 'stored_data:', stored_data)
		} 
	}

	if( ! store || ! isObject( store)){
		if( debug.store) log('notok', 'NO STORE, CREATING ONE')
		store = {}
	}
	else if( debug.store) {
		log('ok', 'GOT store:')
		//log(JSON.stringify(store,null,2))
		log( store)
	}
}
/** Get a possibly stored value || undefined */
function storedValue( elem_id, prop){
	let s = store[ elem_id]
	if( debug.store) log('err', 'get stored:', s, 'elem_id:', elem_id)
	return s ? s[ prop] : undefined
}
/** either save after setting a prop on elem, or just save */
export function saveStore( elem_id, prop, val, remove=false){

	if( stage && stage.do_not_store) return

	//! was async: problem if used on unload event... cannot block 
	//!  => should make async + another sync version for unload

	if( !store) return null //|| CLEAR_STORE

	//log('err', '--save to store, elem id:', elem_id)

	if( elem_id){ //// WE WANT TO SET A STORE VALUE BEFORE SAVING

		if( remove){
			log('err', 'DELETE:', elem_id, prop)
			if( store[ elem_id]){
				delete store[ elem_id][ prop]
				/// if this elem has no more stored props, delete its store
				if( ! Object.keys( store[ elem_id]).length)
					delete store[ elem_id]
			}
		}
		else {
			if( debug.store) log('pink', 'STORE:', elem_id, prop, val)
			if( store[ elem_id] === undefined)
				store[ elem_id] = {}
			store[ elem_id][ prop] = val
		}
	}
	
	// if( !willSave){ //// BATCH CALLS
	// willSave = true
	// await 0;
	// willSave = false
	const str = JSON.stringify( store)
	if( debug.store){
		log('pink', '--will store string:', str)
	}
	localStorage.setItem( store_namespace, str)
	// }
}

export function clearStore( e){
	log('err', 'clear store')
	stage.do_not_store = true // prevent storing on before reload
	localStorage.removeItem( store_namespace)
	log('err', 'Store cleared')
	location.reload()
}



///  Setting many props at once with stored:true, each will call saveStore (writes to LS), 
///  so use a throttled "version" instead
const throttled_saveStore = debounce( saveStore, 200)


///  ————————————————————————————————————————————————————————————————————————————————  ///


define('vision-stage', VisionStage)


///  ————————————————————————————————————————————————————————————————————————————————  ///