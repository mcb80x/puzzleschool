spaceFractionsEditor = exports ? provide('./lib/space_fractions_editor', {})

class spaceFractionsEditor.EditorHelper
    constructor: ({@el, @viewHelper, encodeMethod}) ->
        @encode = encodeMethod
        @initElementSelector()
        @initEditor()
        @initSquares()
        @initLevelDescription()
        
    $: (selector) -> $(selector, @el)
    
    initElementSelector: ->
        @elementSelector = $(document.createElement('DIV'))
        @elementSelector.addClass('element_selector')

        @initObjectSelector()
        @initFractionSelector()

        @el.append(@elementSelector)
        
    initLevelDescription: ->
        explanation = @$('.explanation')
        verifiedMessages = $(document.createElement('DIV'))
        verifiedMessages.addClass('verification_messages')
        verifiedMessages.html '''
            <div class='verification_message verified' style='display: none;'>
                <h3>Verified</h3>
                All ships are full.
            </div>
            <div class='verification_message unverified style='display: none;''>
                <h3>Unverified</h3>
                Not all ships are full.
            </div>
            <a class='play_level' target='_blank'>Play Level</a>
            <p>Share: <input type='text' class='share_link' /></p>
        '''
        verifiedMessages.insertBefore(explanation)

        @playLevel = verifiedMessages.find('.play_level')
        @shareLink = verifiedMessages.find('.share_link')
        
        @levelDescription = $(document.createElement('textarea'))
        @levelDescription.addClass('level_description')
        @levelDescription.insertBefore(explanation)

        loadLevelDescription = $(document.createElement('button'))
        loadLevelDescription.html('Load To Edit')
        loadLevelDescription.bind 'click', => @load()
        loadLevelDescription.insertBefore(explanation)

    initObjectSelector: ->    
        objectSelector = $(document.createElement('DIV'))
        objectSelector.addClass('selector')
        objectSelector.addClass('object_selector')
        objectSelector.html('<h3>Select what to put in this square:</h3>')

        links = $(document.createElement('P'))
        links.html('<a class=\'clear\'>Clear Square</a> &nbsp; &nbsp; &nbsp; <a class=\'close\'>Close Selector</a>')
        links.find('.close').bind 'click', => @closeElementSelector()
        links.find('.clear').bind 'click', => @removeObject()
        objectSelector.append(links)

        for objectType in @sortedObjectTypes()
            do (objectType) =>
                object = @viewHelper.objects[objectType]
                objectContainer = $(document.createElement('DIV'))
                objectContainer.addClass('object')
                objectContainer.addClass(if object.movable then 'movable' else 'static') 
                objectContainer.data('objectType', objectType)
                objectContainer.bind 'click', => @addObject(objectType)

                objectImage = $(document.createElement('IMG'))
                
                src = @viewHelper.baseFolder + object.image
                src += if object.states then '_full.png' else '.png'
                objectImage.attr('src', src)
            
                objectContainer.append(objectImage)
                objectSelector.append(objectContainer)
                                
        @elementSelector.append(objectSelector)

    initEditor: ->    
        editor = $(document.createElement('DIV'))
        editor.addClass('selector')
        editor.addClass('editor')
        @$('.sidebar').append(editor)

        for objectType in @sortedObjectTypes()
            do (objectType) =>
                object = @viewHelper.objects[objectType]
                objectContainer = $(document.createElement('DIV'))
                objectContainer.addClass('object')
                objectContainer.addClass('square')
                editor.append(objectContainer)

                initObjectContainer = =>
                    objectContainer.html('')
                    objectContainer.data('objectType', objectType)
                    
                    objectImage = $(document.createElement('IMG'))

                    src = @viewHelper.baseFolder + object.image
                    src += if object.states then '_full.png' else '.png'
                    objectImage.attr('src', src)

                    objectContainer.append(objectImage)
                    @viewHelper.initMovableObject objectContainer, (selectedSquare) => 
                        if selectedSquare[0] == objectContainer[0]
                            initObjectContainer()
                            return
                        
                        selectedSquare.addClass('selected') 
                        @save()
                        object = @viewHelper.objects[objectType]
                        if (object.distribute and not object.accept) or (object.accept and not object.distribute)
                            @showElementSelector(selectedSquare)
                        else
                            selectedSquare.removeClass('selected')
                        @initMovableObject(selectedSquare)
                        initObjectContainer()

                initObjectContainer()
                    
    
    sortedObjectTypes: ->
        Object.keys(@viewHelper.objects).sort((a, b) => @viewHelper.objects[a].index - @viewHelper.objects[b].index)
    
    initFractionSelector: ->
        @fractionSelector = $(document.createElement('DIV'))
        @fractionSelector.html """
            <h2>Select A Fraction</h2>
            <p>What fraction of laser should this object use?</p>
            <p>
                <input name='numerator' class='numerator' type='text' value='1'/>
                <span class='solidus'>/</span>
                <input name='denominator' class='denominator' type='text' value='1'/>
            </p>
            <p class='fraction'>Fraction: 1/1 or #{Math.round(1000 * (1/1)) / 1000}</p>
            <button class='set_fraction'>Set</button>
            <br/>
            <p><a class='select_new_object'>< Select a different object</a></p>
            <p><a class='clear_square'>Clear Square</a></p>
            <p><a class='close_fraction_selector'>Close Window</a></p>
        """
        
        setFraction = @fractionSelector.find('.set_fraction')
        setFraction.bind 'click', =>
            @[setFraction.data('callback')](
                @fractionSelector.find('.numerator').val(), 
                @fractionSelector.find('.denominator').val()
            )
            @closeElementSelector()

        @fractionSelector.find('.numerator, .denominator').bind 'keyup', => 
            @displayFractionValue()
            @[setFraction.data('callback')](
                @fractionSelector.find('.numerator').val(), 
                @fractionSelector.find('.denominator').val()
            )
                        
        @fractionSelector.find('.select_new_object').bind 'click', => @showSelector('object')
        @fractionSelector.find('.close_fraction_selector').bind 'click', => @closeElementSelector()
        @fractionSelector.find('.clear_square').bind 'click', => @removeObject()
                            
        @fractionSelector.addClass('selector')
        @fractionSelector.addClass('fraction_selector')
        @fractionSelector.hide()
        @elementSelector.append(@fractionSelector)
        
    setFractionValue: (numeratorVal=1, denominatorVal=1) ->
        @fractionSelector.find('.numerator').val(numeratorVal.toString())
        @fractionSelector.find('.denominator').val(denominatorVal.toString())
        @displayFractionValue()

    displayFractionValue: ->
        numeratorVal = @fractionSelector.find('.numerator').val()
        denominatorVal = @fractionSelector.find('.denominator').val()
        @fractionSelector.find('.fraction').html(
            "Fraction: #{numeratorVal}/#{denominatorVal} or #{Math.round(1000 * (numeratorVal/denominatorVal)) / 1000}"
        )

    selectSquare: (square) ->
        @$('.board .selected').removeClass('selected')
        square = $(square)
        square.addClass('selected')
        @showElementSelector(square)
        
    initSquares: ->
        @$('.square').bind 'click', (e) => @selectSquare(e.currentTarget)
            
    showElementSelector: (square) ->
        square = $(square)
        offset = square.offset()
        
        if square.parent().hasClass('options')
            @elementSelector.find('.static').hide()
        else
            @elementSelector.find('.object').show()
        
        @elementSelector.css
            opacity: 0
            top: offset.top + offset.height + 6
            left: offset.left + (offset.width / 2) - (@elementSelector.offset().width / 2)

        @showObjectSelector() 

        @elementSelector.animate
            opacity: 1
            duration: 250
        
            
    closeElementSelector: ->
        @$('.square.selected').removeClass('selected')
        @elementSelector.animate
            opacity: 0
            duration: 250
            complete: =>
                @elementSelector.css
                    top: -1000
                    left: -1000

    addObject: (objectType) ->
        selectedSquare = @$('.square.selected')
        @viewHelper.addObjectToSquare(objectType, selectedSquare)
        selectedSquare.unbind 'mousedown'
        @save()
        
        object = @viewHelper.objects[objectType]
        @showObjectSelector(true)
        
        @initMovableObject(selectedSquare)

    initMovableObject: (square) ->
        @viewHelper.initMovableObject square, (newSquare, data) =>
            newSquare.addClass('selected') 
            @setObjectFraction(data.fullNumerator or data.numerator, data.fullDenominator or data.denominator)
            @save()
            @initMovableObject(newSquare)
            if ($(square)[0] == $(newSquare)[0]) or @elementSelector.css('opacity') > 0
                @showElementSelector(newSquare) 
            else
                newSquare.removeClass('selected') 
           
    removeObject: () ->
        selectedSquare = @$('.square.selected')
        @viewHelper.removeObjectFromSquare(selectedSquare)
        @levelDescription.val('')
        @closeElementSelector()
        @save()
        
    showObjectSelector: (close=false) ->
        selectedSquare = @$('.square.selected')
        
        if not selectedSquare.hasClass('occupied')
            @showSelector('object')
            return
        
        object = @viewHelper.objects[selectedSquare.data('objectType')]
        if (object.distribute and not object.accept) or (object.accept and not object.distribute)
            if @viewHelper.objects[selectedSquare.data('objectType')].states
                @setFractionValue(selectedSquare.data('fullNumerator') or 1, selectedSquare.data('fullDenominator') or 1)
            else
                @setFractionValue(selectedSquare.data('numerator') or 1, selectedSquare.data('denominator') or 1)
            @fractionSelector.find('.set_fraction').data('callback', 'setObjectFraction')
            @showSelector('fraction')
        else
            if close then @closeElementSelector() else @showSelector('object')
        
    setObjectFraction: (numerator, denominator) ->
        selectedSquare = @viewHelper.board.find('.selected')
        if @viewHelper.objects[selectedSquare.data('objectType')].states
            selectedSquare.data('fullNumerator', numerator)
            selectedSquare.data('fullDenominator', denominator)
            @viewHelper.setObjectImage(selectedSquare)
        else
            selectedSquare.data('numerator', numerator)
            selectedSquare.data('denominator', denominator)
        selectedSquare.attr('title', "Fraction: #{numerator}/#{denominator}")
        @viewHelper.showFraction(selectedSquare)
        @viewHelper.fireLaser(selectedSquare)
        @save()
    
            
    showSelector: (selectorPage) ->
        selectors = @elementSelector.find('.selector')
        selector = @elementSelector.find(".#{selectorPage}_selector")
        
        if parseInt(@elementSelector.css('opacity'))
            selectors.animate
                opacity: 0
                duration: 250
                complete: =>
                    selectors.hide()
                    selector.css
                        opacity: 0
                        display: 'block'
                    selector.animate
                        opacity: 1
                        duration: 250
        else   
            selectors.hide()
            selector.css
                opacity: 1
                display: 'block'
    
    save: ->
        @levelDescription.val('')
        levelDescription = {objects: []}

        levelVerified = null
        for square in @viewHelper.board.find('.square.occupied')
            square = $(square)
            object =
                type: square.data('objectType')
                index: square.data('index')
                
            objectMeta = @viewHelper.objects[square.data('objectType')]
            if objectMeta.states
                object.fullNumerator = square.data('fullNumerator')
                object.fullDenominator = square.data('fullDenominator')
                if square.html().indexOf('full') == -1
                    levelVerified = false 
                else if levelVerified == null
                    levelVerified = true
                    
            else if objectMeta.distribute and not objectMeta.accept
                object.numerator = square.data('numerator')
                object.denominator = square.data('denominator')
        
            levelDescription.objects.push(object)

        for square in @viewHelper.options.find('.square.occupied')
            square = $(square)
            object =
                type: square.data('objectType')

            levelDescription.objects.push(object)
        
        levelDescription.verified = levelVerified
        @$('.verification_message').hide()
        if levelVerified
            @$('.verified').show()
        else
            @$('.unverified').show()
            
        json = JSON.stringify(levelDescription)
        @levelDescription.val(json)
        window.location.hash = encodeURIComponent(@encode(json))
        href = window.location.href.toString().replace(/editor/, 'custom')
        @playLevel.attr('href', href)
        @shareLink.val(href)
            
    load: ->
        json = JSON.parse(@levelDescription.val())
        @levelDescription.val('')
        @clear()
        for object in json.objects
            if object.index
                @selectSquare(@viewHelper.board.find(".square.index#{object.index}"))
                @addObject(object.type)
                if (numerator = object.fullNumerator or object.numerator) and 
                   (denominator = object.fullDenominator or object.denominator)
                    @setObjectFraction(numerator, denominator)
            else
                @selectSquare(@viewHelper.options.find(".square:not(.occupied)")[0])
                @addObject(object.type)
        @closeElementSelector()
                
    clear: ->
        for square in @viewHelper.board.find('.square.occupied')
            @selectSquare(square)
            @removeObject()
            
        