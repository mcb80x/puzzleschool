spaceFractionsEditor = exports ? provide('./lib/space_fractions_editor', {})

class spaceFractionsEditor.EditorHelper
    constructor: ({@el, @viewHelper, encodeMethod}) ->
        @encode = encodeMethod
        @initElementSelector()
        @initEditor()
        @initSquares()
        @initLevelDescription()
        @initInstructions()
        
    $: (selector) -> $(selector, @el)
    
    initInstructions: ->
        instructions = $(document.createElement('DIV'))
        instructions.addClass('editor_instructions')
        instructions.html '''
            <h2>Level Editor Instructions</h2>
            <p>Here are some quick instructions on how to create your own level.</p>
            <ul>
                <li><p>Drag objects from the selector in the bottom right corner of the screen on to the board.</p></li>
                <li><p>You can also drop objects on to the right hand sidebar as extra objects.</p></li>
                <li><p>You need at least one laser and one lightbulb and the lightbulb must be lit yellow.</p></li>
                <li><p>When your level is complete it should say "Verified" at the bottom of the page.</p></li>
                <li><p>Share the link to your level!</p></li>
            </ul>
            <p>Click anywhere to close this and get started.</p>
        '''
        @el.append(instructions)
                
        showInstructions = =>
            @disableSquares()
            instructions.css
                top: ($.viewport().height / 2) - (instructions.height() / 2) + (window.scrollY)
                left: ($.viewport().width / 2) - (instructions.width() / 2)
            
            instructions.animate
                opacity: 1
                duration: 500
                
            $(document.body).one 'click.editor_instructions', (e) =>
                instructions.animate
                    opacity: 0
                    duration: 500
                    complete: =>
                        @initSquares()
                        instructions.css
                            top: -1000
                            left: -1000
        
        instructionLink = $(document.createElement('DIV'))
        instructionLink.addClass('editor_instructions_link')
        instructionLink.html '''
            <a>Show Editor Instructions</a>
        '''
        instructionLink.find('a').bind 'click', showInstructions
        @$('.sidebar').append(instructionLink)
    
        $.timeout 500, showInstructions
    
    initElementSelector: ->
        @elementSelector = $(document.createElement('DIV'))
        @elementSelector.addClass('element_selector')
        @elementSelector.bind 'click', (e) -> e.stop()

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
                All sensors are lit up yellow.
            </div>
            <div class='verification_message unverified style='display: none;''>
                <h3>Unverified</h3>
                Not all of the sensors are lit up yellow.
            </div>
            <a class='play_level' target='_blank'>Play Level</a>
            <p>Share: <input type='text' class='share_link' /></p>
        '''
        verifiedMessages.insertBefore(explanation)

        @playLevel = verifiedMessages.find('.play_level')
        @shareLink = verifiedMessages.find('.share_link')
        
        levelEditor = $(document.createElement('DIV'))
        levelEditor.addClass('level_editor')
        levelEditor.insertBefore(explanation)
        
        @levelDescription = $(document.createElement('textarea'))
        @levelDescription.addClass('level_description')
        levelEditor.append(@levelDescription)

        loadLevelDescription = $(document.createElement('button'))
        loadLevelDescription.html('Load To Edit')
        loadLevelDescription.bind 'click', => @load()
        levelEditor.append(loadLevelDescription)
        
        loadLevelButton = $(document.createElement('button'))
        loadLevelButton.addClass('load_custom_level_data')
        loadLevelButton.html('Show Custom Level Data')
        loadLevelButton.insertBefore(explanation)
        


    initObjectSelector: ->    
        objectSelector = $(document.createElement('DIV'))
        objectSelector.addClass('selector')
        objectSelector.addClass('object_selector')
        objectSelector.html('<h3>Select what to put in this square:</h3>')
        objectSelector.bind 'click', (e) -> e.stop()

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
                objectMeta = @viewHelper.objects[objectType]
                objectContainer = $(document.createElement('DIV'))
                objectContainer.addClass('object')
                objectContainer.addClass('square')
                editor.append(objectContainer)

                initObjectContainer = =>
                    objectContainer.html('')
                    objectContainer.addClass('occupied')
                    objectContainer.data('objectType', objectType)
                    
                    objectImage = $(document.createElement('IMG'))

                    src = @viewHelper.baseFolder + objectMeta.image
                    src += if objectMeta.states then '_full.png' else '.png'
                    objectImage.attr('src', src)

                    objectContainer.append(objectImage)
                    objectContainer.bind 'mousedown', =>
                        @closeElementSelector()
                        @$('.square.selected').removeClass('selected')
                        
                    if not objectMeta.movable
                        objectContainer.unbind('mousedown.static mouseup.static')
                        objectContainer.bind 'mousedown.static', =>
                            @viewHelper.options.find('.square.occupied').addClass('actually_occupied')
                            @viewHelper.options.find('.square').addClass('occupied')
                        objectContainer.bind 'mouseup.static', =>
                            @viewHelper.options.find('.square').removeClass('occupied')
                            @viewHelper.options.find('.square.actually_occupied').addClass('occupied')
                            @viewHelper.options.find('.square.actually_occupied').removeClass('actually_occupied')
                        
                    @viewHelper.initMovableObject objectContainer, (selectedSquare) =>
                        if selectedSquare[0] == objectContainer[0]
                            initObjectContainer()
                            return
                        
                        selectedSquare.addClass('selected') 
                        selectedSquare.unbind 'click.tip'
                        
                        @save()
                        if (objectMeta.distribute and not objectMeta.accept) or (objectMeta.accept and not objectMeta.distribute)
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
        
        @fractionSelector.bind 'click', (e) -> e.stop()
        
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
        @$('.square.selected').removeClass('selected')
        square = $(square)
        square.addClass('selected')
        @showElementSelector(square)
        
    initSquares: ->
        @$('.square').bind 'click.select_square', (e) => @selectSquare(e.currentTarget)
        
    disableSquares: ->
        @$('.square').unbind 'click.select_square'
            
    showElementSelector: (square) ->
        square = $(square)
        @elementSelector.data('square', square.data('index'))
        @elementSelector.data('area', (if square.parent().hasClass('board') then 'board' else 'options'))
        offset = square.offset()
        
        if square.parent().hasClass('options')
            @elementSelector.find('.static').hide()
        else
            @elementSelector.find('.object').show()
        
        @elementSelector.css(opacity: 0)
        @positionElementSelector()            
        @elementSelector.scrollTop(0)

        @showObjectSelector() 

        @elementSelector.animate
            opacity: 1
            duration: 250
            complete: =>
                @disableSquares()
                $(document.body).one 'click.element_selector', (e) => 
                    e.stop()
                    @closeElementSelector()
                    
            
    closeElementSelector: ->
        $(document.body).unbind 'click.element_selector'
        @getElementSelectorSquare().removeClass('selected')
        @elementSelector.animate
            opacity: 0
            duration: 250
            complete: =>
                @initSquares()
                @elementSelector.css
                    top: -1000
                    left: -1000

    getElementSelectorSquare: -> @$(".#{@elementSelector.data('area')} .square.index#{@elementSelector.data('square')}")

    addObject: (objectType) ->
        selectedSquare = @getElementSelectorSquare()   
        @viewHelper.removeObjectFromSquare(selectedSquare)
        @viewHelper.addObjectToSquare(objectType, selectedSquare)
        selectedSquare.unbind 'click.tip'
        @save()
        
        object = @viewHelper.objects[objectType]
        @showObjectSelector(true)
                
        @initMovableObject(selectedSquare)
        
    positionElementSelector: ->
        selectedSquare = @getElementSelectorSquare()
        offset = selectedSquare.offset()
        @elementSelector.css
            top: offset.top + offset.height + 6
            left: offset.left + (offset.width / 2) - (@elementSelector.offset().width / 2)
        

    initMovableObject: (square) ->
        @viewHelper.initMovableObject square, (newSquare, data, moved) =>
            newSquare.addClass('selected')
            newSquare.unbind('click.tip')
            
            previousSquareIndex = @elementSelector.data('square')
            previousSquareArea = @elementSelector.data('area')
            @elementSelector.data('square', newSquare.data('index'))
            @elementSelector.data('area', (if newSquare.parent().hasClass('board') then 'board' else 'options'))
            
            if moved
                @setObjectFraction(data.fullNumerator or data.numerator, data.fullDenominator or data.denominator)
            
            if parseInt(@elementSelector.css('opacity'))
                if previousSquareIndex == square.data('index') and
                   previousSquareArea == (if square.parent().hasClass('board') then 'board' else 'options')
                    @positionElementSelector()    
                else
                    @closeElementSelector()
             
            @save()
            @initMovableObject(newSquare)
            newSquare.removeClass('selected') 
           
    removeObject: () ->
        selectedSquare = @getElementSelectorSquare()
        @viewHelper.removeObjectFromSquare(selectedSquare)
        @levelDescription.val('')
        @closeElementSelector()
        @save()
        
    showObjectSelector: (close=false) ->
        selectedSquare = @getElementSelectorSquare()
        
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
        
    setObjectFraction: (numerator=1, denominator=1) ->
        selectedSquare = @getElementSelectorSquare()
        objectMeta = @viewHelper.objects[selectedSquare.data('objectType')]
        return unless objectMeta.showFraction
        if objectMeta.states
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
            
        