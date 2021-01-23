# vision stage

## Modern Web apps in no time | simple components in pure JS/HTML 

- no build required, no custom syntax or complex behaviors
- minimal, <intuitive API>, intuitive layout, localized strings
- staged content (scaled rem / framed within flexible limits) 
- scenes menu (virtual pages – *1) | options menu (+FS+LANG) 
? | auth/menu & user data (firebase)

*1 you can show/hide elements
	- auto by scene with css: <div show-for:scene="A C">
	- abitrarily with class: <div class="${ this.show_elX ? '' : 'hide' }">
	- render or not: 