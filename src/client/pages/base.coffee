soma = require('soma')
wings = require('wings')

class soma.View extends soma.View
    hashChanges: {}
    registerHashChange: (hash, callback) => @hashChanges[hash.replace(/#/, '')] = callback
    
soma.chunks
    Base:
        shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        prepare: ({@content}) ->
            @loadElement 'link', {href: '/assets/images/favicon.ico', rel: 'shortcut icon', type: 'image/x-icon'}
            
            @loadScript '/build/client/pages/base.js'
            @loadScript '/build/client/pages/home.js'
            @loadScript '/build/client/pages/about.js'
            @loadScript '/build/client/pages/labs.js'

            @loadStylesheet '/build/client/css/all.css'

            @loadScript '/assets/analytics.js'
                        
            @template = @loadTemplate '/build/client/templates/base.html'
            @loadChunk @content


        build: () ->
            @setTitle('The Puzzle School')
            data = 
                loggedIn: @cookies.get('user')?
                content: @content
                months: ({ label: @shortMonths[i-1], value: i } for i in [1..12])
                days: [1..31]
                years: [((new Date).getFullYear() - 18)..1900]
            
            @html = wings.renderTemplate(@template, data)
            
soma.views
    Base:
        selector: '#base'
        
        create: ->
            unless window.initialized
                window.initialized = true
                window.postRegistration = []
                $(window).bind 'hashchange', => @onhashchange()
            
            @checkLoggedIn()
            @$('.log_out').bind 'click', => @logOut()

            @registerHashChange 'register', => @showRegistration()
            @$('.register').bind 'click', => location.hash = 'register'

            @registerHashChange 'login', => @showLogIn()
            @$('.log_in').bind 'click', => location.hash = 'login'
            
            @$('.close_modal').bind 'click', (e) => @hideModal(e.currentTarget)
            
            @onhashchange()

        onhashchange: () -> callback() if (callback = @hashChanges[location.hash.replace(/#/, '')])
                  
        formData: (form) ->
            data = {}
            fields = $('input, select', form)
            for field in fields
                if field.type not in ['radio', 'checkbox'] or field.checked
                    val = $(field).val()

                    if field.name.slice(-2) == '[]'
                        name = field.name.slice(0, -2)
                        if name not of data
                            data[name] = []

                        data[name].push(val)

                    else
                        data[field.name] = val
            return data
                  
                            
        showRegistration: () ->
            @showModal('.registration_form')
            @$('.registration_form .cancel_button').bind 'click', () => @hideModal('.registration_form')

            submitForm = () =>
                form = @$('.registration_form form')
                $.ajaj
                    url: '/api/register'
                    method: 'POST'
                    data: @formData(form)
                    success: () =>
                        @hideModal(form)
                        if window.postRegistration.length
                            (postRegistrationMethod => @checkLoggedIn()) for postRegistrationMethod in window.postRegistration
                        else
                            @checkLoggedIn()
                
            @$('.registration_form input').bind 'keypress', (e) => submitForm() if e.keyCode == 13
            @$('.registration_form .register_button').bind 'click', () => submitForm()
                
        showLogIn: () ->  
            @showModal('.login_form')
            @$('.login_form .cancel_button').bind 'click', () => @hideModal('.login_form')
            
            submitForm = () =>
                form = @$('.login_form form')
                $.ajaj
                    url: '/api/login'
                    method: 'POST'
                    data: @formData(form)
                    success: () => 
                        @hideModal(form)
                        @checkLoggedIn()
                
            @$('.login_form input').bind 'keypress', (e) => submitForm() if e.keyCode == 13
            @$('.login_form .login_button').bind 'click', () => submitForm()
                
            
        logOut: () ->
            @cookies.set('user', null)
            @$('.logged_in').animate
                opacity: 0
                duration: 500
                complete: =>
                    @$('.logged_out').css(opacity: 0)
                    @el.removeClass('logged_in')
                    @el.addClass('logged_out')
                    @$('.user_name').html('')
                    @$('.logged_in').css(opacity: 1)    
                    @$('.logged_out').animate
                        opacity: 1
                        duration: 500
                        complete: => @go(location.pathname, true)
                
        checkLoggedIn: () ->
            return unless (@user = @cookies.get('user'))?
            if @el.hasClass('logged_out')
                @go(location.pathname, true)
                
            @$('.user_name').html(@user.name)
        
        
        showModal: (selector) ->
            @opaqueScreen = $('.opaque_screen')
            @opaqueScreen.css(opacity: 0, top:0, left: 0, width: $(document.body).width(), height: $(document.body).height() + $('#top_nav').height())
            @opaqueScreen.animate
                opacity: 0.75
                duration: 300
                
            modal = @$(selector)
            modal.css
                top: 120
                left: ($(document.body).width() - modal.width()) / 2
            modal.animate
                opacity: 1
                duration: 500

            modal.bind 'click', (e) => e.stop()
            $(@opaqueScreen).bind 'click', () => @hideModal(selector)
        
        hideModal: (selector) ->
            $(@opaqueScreen).unbind 'click'
            modal = if selector instanceof String then @$(selector) else $(selector)
            modal = modal.closest('.modal') unless modal.hasClass('modal')
            @opaqueScreen.animate(opacity:0, duration: 500, complete: () => @opaqueScreen.css(top: -1000, left: -100))
            modal.animate
                opacity: 0
                duration: 500
                complete: () =>
                    modal.css
                        top: -1000
                        left: -1000
                    location.hash = ''
                    
            
