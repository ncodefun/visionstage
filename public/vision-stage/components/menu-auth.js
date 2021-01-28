const PROD = true /// enables firebase analitycs
const DEBUG = false
const FIREBASE_CONFIG = {
// 	apiKey: '',
// 	authDomain: '',
// 	databaseURL: '',
// 	projectId: '',
// 	storageBucket: '',
// 	messagingSenderId: '',
// 	appId: '',
// 	measurementId: ""
}

import { Component, html, define, log, useSVG, unsafeHTML } from '../vision-stage.js'
import { q, ctor } from '../modules/utils-core.js'
import * as _firebase from '../modules/firebase/app.js';
import "/vision-stage/modules/firebase/auth.js"
import "/vision-stage/modules/firebase/firestore.js"
import "/vision-stage/modules/firebase/analytics.js"

Component.load('inputs/button-waiting')
//! popups

const app = q('vision-stage')
const app_name = app.app_name // -> from 'store' attr on <vision-stage>

const ALLOW_AUTO_SIGNIN = true
const firebase = _firebase.default
app.authentified = false
//log('err', 'app name:', app_name)
function generatePassword() {
		//! test
    let length = 4,
        charset = '0123456789', // "abcdefghijklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789",
        retVal = ""
    for( let i = 0, n = charset.length; i < length; ++i)
      retVal += charset.charAt( Math.floor( Math.random() * n))
    return retVal
}

class AuthMenu extends Component {

	onConnected(){
		app.menu_auth = this
		if( !this.firebase_initialized)
			this.initFirebase()
		this.render()
		this.classList.add('menu', 'menu-auth')
	}

	template(){
		const verified = this.user && this.user.emailVerified
		const email = this.user ? this.user_email.split('@').join('<wbr>@') : ''

		return html`
		<div class='menu-body' flow='col top stretch'>
			<!--// header inside div... //-->
			<header>
				<button ?disabled=${!this.user} class='round signout ${app.UI_button_size_class}' @click=${this.signOut}>
					${useSVG('exit','exit abs','xMidYMid slice')}
				</button>
				${
					email ? html`
					<div id='identifier' flow='col' class=${verified?'':'unverified'}>
						<div>${unsafeHTML(email)||'@'}</div>	
					</div>` 
					: html`<h2>${this.form==='signup'?this.$signup:this.$connect}</h2>
						<button @click=${this.toggleForm} class='small abs ${this.form==='signin'?'signup':'signin'}'>${this.form==='signin'?this.$signup:this.$connect}&nbsp;${useSVG('fat-arrow-right2','go-arrow')}</button>`
				}
			</header>

			<section id="unverified-user" class=${ verified||!this.user ? 'hide' : '' }>
				<h2>${ this.$please_verify_email}</h2>
				<p>${ this.$verification_email_sent }</p>
				<p lang='fr'>Pour envoyer le courriel de nouveau,<br>cliquez ici&thinsp;:</p>
				<p lang='en'>To send the email again,<br>click here&thinsp;:</p>
				<p>
					<button-waiting id='btn-send-email-confirmation-link'
						class='block'
						strings:fr="label: Envoyez, label-done: Envoyé&thinsp;!" 
						strings:en="label: Send, label-done: Sent&hairsp;!"
						@click=${ this.sendEmailConfirmationLink }>
					</button-waiting>
				</p>
			</section>

			<section class='main' flow='col top stretch'>
				<header></header>
				${ this.auth_ready && this.formTemplate() || '' }
			</section>
		</div>`
	}

	toggleForm(){
		this.form = this.form==='signup' ? 'signin' : 'signup'
	}

	initFirebase(){
		this.firebase_initialized = true
		const firebase_config = ctor( app).firebase_config || FIREBASE_CONFIG
		if( !firebase_config || !firebase_config.apiKey){
			log('err', 'No default FIREBASE_CONFIG nor App.firebase_config')
			throw Error('No default FIREBASE_CONFIG nor App.firebase_config')
		}
		this.firebase = firebase.initializeApp( firebase_config, 'apps');
		this.auth = this.firebase.auth()
		this.auth.languageCode = app.lang
		this.auth.onAuthStateChanged( this.onAuthStateChanged.bind( this))
	}

	watchUserConnection( user){
		//! if another is watching, will be signed out
		this.firestore.doc(`users_public/${user.uid}/`).set({ connected:false },{ merge:true })
			.catch( err => log('err', 'err setting connected:', err))
			.then( () => {
				this.firestore.doc(`users_public/${user.uid}/`).onSnapshot( doc => {
					const data = doc.data()
					/// skip first and second calls
					if( !this.watchingUserConnection){
						this.watchingUserConnection = 1
						/// this will trigger a second snapshot callback
						this.firestore.doc(`users_public/${user.uid}/`).set({ connected:true },{ merge:true })
							.catch( err => log('err', 'err setting connected:', err))
						return
					}
					/// make sure it follows above set(), else racing: connected
					else if( this.watchingUserConnection === 1){ // 
						this.watchingUserConnection = 2
						return
					}

					if( data.role && data.connected===false) /// if role it means we're later
						this.signOut()	
				})
				//.catch( err => log('err', 'err:', err))
			})
	}

	onAuthStateChanged( user){
		if( q('#btn-ok')) 
			q('#btn-ok').waiting = false

		DEBUG && log( 'purple','user:', 
			user && user.email||'none', 'verified:', !!(user && user.emailVerified))

		this.user_uid = null
		this.user_signed_in = false

		if( !user){
			// close scenes menu; we're gonna open this menu
			if( app.menu_scenes && app.menu_scenes.open)
				app.menu_scenes.open = false
			setTimeout( e => this.open = true, 500)
		}
		else { // user exists
			this.user = user
			this.user_email = user.email

			if( this.send_email_verification){
				this.send_email_verification = false
				user.sendEmailVerification()
					.catch( err => {
						this.message = "<p>Error, please try again later by clicking the button below.</p><p>Impossible d'envoyer un courriel de vérification pour l'instant, veuillez essayer plus tard en cliquant sur le bouton <em>Envoyer</em> plus bas.</p>"
					})
					.then( () => log('err','sent email verif email...'))
			}

			// First time only
			if( !this.firestore){
				this.firestore = this.firebase.firestore()
				// this.firestore.enablePersistence()
				/*
				if( PROD){
					this.firebase.analytics().logEvent('app_loaded', {
						title: app.$title,
						scene: app.scene||'none',
					})
					DEBUG && log('info', '-> Analytics; app title:', app.$title, 'scene:', app.scene||'none')
				}*/
			}

			// get user data and call if app.onUserDataReady 
			// => set as this.user_data
			if( !this.user_data) // first time only
			this.firestore.doc(`users_public/${user.uid}/`).get()
				.then( doc => {
					if( doc && doc.exists)
						this.user_data = doc.data()
					else {
						this.user_data = {
							role: '',
							subs: {

							}
						}
					}

					//  MANAGE USER ACCESS LEVEL  //

					const app_lvl = app.access_level||1 // 1: ifConnected, 2: ifSubscribed
					this.subs = this.user_data.subs || {}
					this.user_role = this.user_data.role || ''
					q('.app').setAttribute('user-role', this.user_role)
					
					// get OBJECT WITH KEY=(APP NAME), VAL=(SUBS ACTIVE? 0:FALSE, 1:TRUE)
					this.subscriptions = Object
						.entries( this.subs) // ex: subs = { visionneuse: 1 }
						.filter( ([k,v]) => v!=0) // keep only active subs 
						.map( ([k,v]) => k) // keep only app names

					const app_name = app.app_name // => store attr on <vision-stage>

					this.user_subscribed =
						this.subscriptions.some( sub => app_name.includes( sub))
						||
						this.subscriptions.includes('all')

					if( this.user_subscribed){
						//this.watchUserConnection( user)

					}
					
					//! App require subscription, popup w/ link to subscribe
					if( app_lvl === 2 && !this.user_subscribed){ 
						setTimeout( e => {
							app.popup.setMessage([ //@TODO localize
								`Cette application requiert un abonnement.`,
								`<a href='/abonnement'>Abonnez-vous ici</a>`])
						}, 0)
						return
					}

					//! App is for admins only, nuke all content
					if( app_lvl === 3 && this.user_role !== 'admin'){
						app.innerHTML = //@TODO localize
							'<p class="warning">Cette page est réservée aux administrateurs du site.</p>'
						return
					}

					if( this.open){
						if( this.just_signed_up){
							// keep menu open so we can read the "validate your email address" msg...
							this.just_signed_up = false
						}
						// OK, hide menu-auth	
						else {
							this.open = false
						}
					}

					app.authentified = true
					app.onUserDataReady && app.onUserDataReady( this.user_data)
				})
				/*.catch( err => {
					//alert ("ERR: "+err)
					log('warn','error while user_public:', err)
					//! we cannot know if user is subscribed...
					/// this should not happen even offline (firestore persistance is enabled)
					/// so do not show the page...
				})*/
		}

		// log('purple', 'AUTH READY')
		this.auth_ready = true
		this.render() /// sets view according to !!this.user
	}

	formSignin(){
		//-- placeholder needs not be empty (CSS is using :placeholder-shown)
		//-- .value=${ this.user_password || '' }
		const hide_signin = !this.auth_ready || !!this.user 
		if( hide_signin) return ''
		return html`
		<form class='signin' flow='col top stretch' novalidate spellcheck="false">

			<div flow='row' class='input email'>
				<div flow class='icon abs left'>${useSVG('envelope')}</div>
				<input type='email' required
					id='user-email-input' 
					placeholder=${this.$email}
					autocomplete='username email' 
					pattern='\\S+@\\S+?\\.\\S{2,}'
					value=${ this.user_email || '' }
					@input=${ this.onEmailInput }>
			</div>

			<div flow='row' class='input password'>
				<div flow class='icon abs left'>${useSVG('padlock','','xMidYMid meet')}</div>
				<input type=${ this.show_password ? 'text':'password' } required
					id='user-password-input'
					placeholder=${this.$password}
					autocomplete='current-password' 
					pattern='.{6,}'
					@input=${ this.onPasswordInput }
					@keydown=${ this.signinOnEnter }
					@invalid=${ this.onInvalid }>
				<button type='button' id='btn-show-password' class='round bare' 
					@click=${ this.togglePasswordVis }>
					${ useSVG( 'eye-' + (this.show_password ? "hide" : "show") )}
				</button>
			</div>

			<button-waiting id='btn-ok' color=''
				.waiting=${ this.waiting }
				aria-label=${ this.$connect }
				@click='${ this.signIn }'
				>
				${ useSVG('fat-arrow-right2','','none') }
			</button-waiting>

			<p flow id='auth-message' class="${ this.message_type||'' }">${ this.message||'' }</p>

			<button type='button' id='btn-forgot-password' class='small' 
				info-tip=${this.$forgot_password_tip}
				@click='${ this.sendPasswordResetEmail }'>
				${ this.$forgot_password }
			</button>

		</form>`
	}

	formSignup(){
		return html`
		<form class='signup' flow='col top stretch' novalidate spellcheck="false">
			<div flow='row' class='input email'>
				<div flow class='icon abs left'>${useSVG('envelope')}</div>
				<input type='email' required
					id='user-email-input' 
					placeholder=${this.$email}
					autocomplete='username email' 
					pattern='\\S+@\\S+?\\.\\S{2,}'
					value=${ this.user_email || '' }
					@input=${ this.onEmailInput }>
			</div>

			<div flow='row' class='input password'>
				<div flow class='icon abs left'>${useSVG('padlock','','xMidYMid meet')}</div>
				<input type=${ this.show_password ? 'text':'password' } required
					id='user-password-input'
					placeholder=${this.$password}
					autocomplete='new-password' 
					pattern='.{6,}'
					@input=${ this.onPasswordInput }
					@invalid=${ this.onInvalid }>
				<button type='button' id='btn-show-password' class='round bare' 
					@click=${ this.togglePasswordVis }>
					${ useSVG( 'eye-' + (this.show_password ? "hide" : "show") )}
				</button>
			</div>

			<div flow='row' class='input password'>
				<div flow class='icon abs left'>${useSVG('padlock','','xMidYMid meet')}</div>
				<input type=${ this.show_password ? 'text':'password' } required
					id='user-password-input2'
					placeholder=${this.$password_again}
					autocomplete='new-password' 
					pattern='.{6,}'
					@keydown=${ this.signupOnEnter }
					@invalid=${ this.onInvalid }>
			</div>

			<button-waiting id='btn-ok' color=''
				.waiting=${ this.waiting }
				aria-label=${ this.$connect }
				@click='${ this.signUp }'
				>
				${ useSVG('fat-arrow-right2','','none') }
			</button-waiting>

			<p flow id='auth-message' class="${ this.message_type||'' }">${ this.message||'' }</p>

		</form>
		`
	}

	formTemplate(){
		// @invalid='${ e => e.target.setCustomValidity( this.$email_format) }'
		return this.form==='signin' ? this.formSignin() : this.formSignup()
	}

	signUp( e){
		this.show_password = false
		if( q('form.signup').reportValidity()){
			const confirm_password = this.q('#user-password-input2').value
			
			if( this.user_password === confirm_password){
				this.firebase.auth()
					.createUserWithEmailAndPassword( this.user_email, this.user_password)
					//! THEN => ONAUTHCHANGED
					.then( () => {
						this.just_signed_up = true
						this.message = 
						this.message_type = 
						this.user_password = ''
						this.send_email_verification = true
						q('#btn-ok').waiting = false
						this.form = 'signin' // this will hide form b/c user exists
					})
					.catch( err => {
						this.message = this.getString( err.code)
						this.message_type = 'error'
						q('#btn-ok').waiting = false
					})
			}
			else {
				DEBUG && log('err','passwords do not match')
				this.message = this.getString('passwords-do-not-match')
				this.message_type = 'error'
				q('#btn-ok').waiting = false
			}
		}
		else {
			q('#btn-ok').waiting = false
		}
	}

	signIn( e){
		this.show_password = false
		if( q('form.signin').reportValidity()){
			this.firebase.auth()
				.signInWithEmailAndPassword( this.user_email, this.user_password)
				//! THEN => ONAUTHCHANGED
				.then( () => {
					this.message = 
					this.message_type = 
					this.user_password = ''
					this.prevent_auto_signin = true
				})
				//// CANNOT SIGN IN
				.catch( err => { 
					log('err', 'FIREBASE ERROR', err.code, err.message)
					this.message = this.getString( err.code) || err.code /// this['$'+err.code]
					this.message_type = 'error'
					this.user_password = ''
				})
		}
		else {
			q('#btn-ok').waiting = false
		}
	}

	signOut( e){
		app.authentified = false
		this.firebase.auth().signOut()
			.catch( err => console.log( err))
			.then( () => {
				this.watchingUserConnection = 0
				this.user = null
				this.user_data = null
				this.user_role = ''
				this.user_email = ''
				this.render()
			})
	}

	signinOnEnter( e){
		if( e.key==='Enter'){
			q('#btn-ok').waiting = true
			e.preventDefault()
			this.signIn()
		}
	}

	signupOnEnter( e){
		if( e.key==='Enter'){
			q('#btn-ok').waiting = true
			e.preventDefault()
			this.signUp()
		}
	}
	
	onInvalid( e){
		e.target.setCustomValidity( this.$password_format)
	}

	onEmailInput( e){
		this.user_email = e.target.value
		this.message = ''
		e.target.setCustomValidity('')
	}

	onPasswordInput( e){
		this.user_password = e.target.value
		e.target.setCustomValidity('') 
	}

	togglePasswordVis(){
		this.show_password = !this.show_password
	}

	// for button-waiting 
	sendEmailConfirmationLink( e){
		this.firebase.auth().currentUser.sendEmailVerification()
			.then( () => {
				e.currentTarget.done = true // <button-waiting>
			})
			.catch( err => {
				this.message = "Une erreur s'est produite, veuillez réessayer de nouveau."
			})
	}

	sendPasswordResetEmail( e){
		const email_input = this.q('#user-email-input')

		if( !this.user_email){
			email_input.reportValidity()
			email_input.setCustomValidity( this.getString('no-email'))
		}
		else if( email_input.validity.patternMismatch) {
			email_input.reportValidity()
			// disable next line to have specific, native error about email format (missing @ etc.)
			// but if missing .com (not natively checked), 
			// the generic message is bof (please respect the required format)
			// leave uncommented to have always a custom message (badly formated email adress)
			email_input.setCustomValidity( this.getString('email-format'))
		}
		else // OK
			this.firebase.auth()
			.sendPasswordResetEmail( this.user_email)
			.then( () => {
				this.message_type = 'success'
				this.message = this.getString( 'password-reset-email-sent')
				email_input.setCustomValidity('') // in case user sign-in right after and was an error
			})
			.catch( err => {
				log('err', err.code, err.message)
				// TODO
				//popup.setMessage( 'error', string( err.code, 'raw') || err.message)
			})
	}
}

AuthMenu.properties = {
	form: 'signin',
	open: {
		value: false,
		class: 'open',
		watcher( val){
			app.opened_menu = val&&'auth'||''
		}
	},
	message: { value: '', watcher( val){ if( !!val){ this.waiting = false }}},
	waiting: { 
		value: '', 
		watcher( val){ 
			if( !!val){ this.message = '' }
		}},
	show_password: false,
	user_email: {
		value: '',
		stored: true
	},
	user_password: '',
	user_data: null,
	selected_tab: {
		value: 0,
		//stored: true, 
		// init_watcher: true,
		// watcher( val){
		// 	this.student_signin_mode = val===1

		// }
	},
	access_level_label: '',
	subscriptions: null,
	prevent_auto_signin: {
		value: false,
		stored: true
	},
}

AuthMenu.strings = {
	en: {
		'email': "Email",
		'password': "Password",
		'password_again': "Confirm password",
		'please_verify_email': "Verify<br>your email address",
		'verification-email-sent':
			"An email has been sent to you – please verify your email address by clicking on the link provided.",
		'password-reset-email-sent': "You will soon receive an email with a reset link.",
		'forgot-password': "Forgotten password",	
		'forgot-password-tip': "We'll send you an email to change your password.",	
		'connect': "signin",
		'signup': "signup",
		'signout': "Sign out",
		'connected': "Signed in",

		'passwords-do-not-match': ">The two passwords do not match",
		'email-format': "Email address is badly formated",
		'password-format': "6 characters minimum",
		'no-email': "Missing email address",
		// ERRORS
		'auth/wrong-password': "Wrong password",
		'auth/email-already-in-use': "Email already registered",
		'auth/user-disabled': "Account disabled",
		'auth/internal-error': "Server error",

	},
	fr: {
		'email': "Courriel",
		'password': "Mot de passe",
		'password_again': "Confirmez le mot de passe",
		'please_verify_email': "Confirmez<br>votre adresse courriel",
		'verification-email-sent':
			"Vous recevrez un courriel d'ici peu,<br>veuillez cliquer sur le lien qu'il contient afin de confirmer votre adresse courriel.",
		'password-reset-email-sent': "Vous recevrez un courriel contenant un lien de réinitialisation.",
		'forgot-password': "Mot de passe oublié",	
		'forgot-password-tip': "Un courriel vous sera envoyer pour changer votre mot de passe.",
		'connect': "Connexion",
		'signup': "Enregistrement",
		'signout': "Déconnexion",
		'connected': "Connecté",
		'passwords-do-not-match': ">Les deux mots de passes ne sont pas identiques",
		'email-format': "L'adresse courriel n'est pas bien formatée.",
		'password-format': "Minimum de 6 caractères",
		'no-email': "Adresse courriel manquante",
		// ERRORS
		'auth/wrong-password': "Mot de passe non valide",
		'auth/email-already-in-use': "Cette adresse courriel est déjà enregistrée",
		'auth/user-disabled': "Compte désactivé",
		'auth/internal-error': "Erreur du server",
	}
}

define( 'menu-auth', AuthMenu, ['popup-full'])