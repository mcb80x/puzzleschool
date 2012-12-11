soma = require('soma')
wings = require('wings')


soma.chunks
    Xyflyer:
        meta: -> new soma.chunks.Base({ content: @ })

        prepare: ({@classId, @levelId}) ->
            @template = @loadTemplate "/build/common/templates/puzzles/xyflyer.html"
            @loadScript '/build/common/pages/puzzles/lib/xyflyer.js'
            @loadScript '/build/common/pages/puzzles/lib/tdop.js'
            @loadScript '/assets/third_party/equation_explorer/tokens.js'
            @loadScript '/assets/third_party/raphael-min.js'
            
            @objects = []
            for object in ['island', 'plane']
                @objects.push(
                    name: object
                    image: @loadImage("/assets/images/puzzles/xyflyer/#{object}.png")
                )
            
            if @levelId == 'editor'
                @loadScript '/build/common/pages/puzzles/lib/xyflyer_editor.js' 
            @loadStylesheet '/build/client/css/puzzles/xyflyer.css'     
            
                      
        build: ->
            @setTitle("XYFlyer - The Puzzle School")
            
            @html = wings.renderTemplate(@template, objects: @objects)
            
        
soma.views
    Xyflyer:
        selector: '#content .xyflyer'
        create: ->
            xyflyer = require('./lib/xyflyer')
            @viewHelper = new xyflyer.ViewHelper
                el: $(@selector)
                boardElement: @$('.board')
                objects: @$('.objects')
                grid:
                    xMin: -10
                    xMax: 10
                    yMin: -10
                    yMax: 10
                
            @tdop = require('./lib/tdop')
            
            @initEquations()
            
            @$('.launch').bind 'click', => @viewHelper.launchPlane()

                
        initEquations: ->
            @$('.equation').bind 'keyup', (e) =>
                input = e.currentTarget
                try
                    formula = @tdop.compileToJs($(input).val())                
                catch err
                    
                @viewHelper.plot(formula, input.id)


soma.routes
    '/puzzles/xyflyer/:classId/:levelId': ({classId, levelId}) -> 
        new soma.chunks.Xyflyer
            classId: classId
            levelId: levelId

    '/puzzles/xyflyer/:levelId': ({levelId}) -> 
        new soma.chunks.Xyflyer
            levelId: levelId
    
    '/puzzles/xyflyer': -> new soma.chunks.Xyflyer

