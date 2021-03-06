# BigSeed: https://itunes.apple.com/us/app/bigseed/id482245645?mt=8
# GoGoGames: http://hackeducation.com/2012/10/31/app-of-the-month-october-2012/
# Stack the States: https://itunes.apple.com/us/app/stack-the-states/id381342267?mt=8
# Hax Attacks: https://itunes.apple.com/ua/app/hax-attacks/id556677673?mt=8
# Build With Chrome http://www.buildwithchrome.com/
# Lightbot: http://armorgames.com/play/6061/light-bot-20

soma = require('soma')
wings = require('wings')

soma.chunks
    Puzzles:
        meta: -> new soma.chunks.Base({ content: @ })

        prepare: ({}) ->
            @template = @loadTemplate '/build/common/templates/puzzles.html'

        build: () ->
            @setTitle("Puzzles - The Puzzle School")
            @html = wings.renderTemplate(@template, puzzles: PUZZLEDATA, labs: LABDATA)
        
soma.views
    Puzzles:
        selector: '#content .puzzles'
        create: ->
            $('.register_flag').hide()    
            
            @$('.rating p').bind 'click', (e) => @showSection(e.currentTarget)
            
        showSection: (navElement) ->
            @$('.rating p.selected').removeClass('selected')
            selected = navElement.className.replace(/\s/ig, '')
            $(navElement).addClass('selected')
            @$('.explanation.selected').removeClass('selected')
            @$(".explanation.#{selected}").addClass('selected')
                    

soma.routes
    '/labs': -> new soma.chunks.Puzzles
    '/puzzles': -> new soma.chunks.Puzzles

PUZZLEDATA = [{
    id: 'architect'
    title: 'Architect'
    website: '/puzzles/architect'
    thumbnail: '/assets/images/reviews/architect.jpg'
    company: 'The Puzzle School'
    companyWebsite: 'http://puzzleschool.com'
    material: 'Spatial Skills'
    availability: 'Mobile, Tablet'
    cost: '$0.99'
    overall:
        explanation:
            """
            <p>
                Architect is not an educational puzzle. It can help develop spatial skills, which have been shown to
                <a href='http://medicalxpress.com/news/2012-07-spatial-skills.html' target='_blank'>improve performance in STEM subjects</a>,
                but does not approach any other educational material.
            </p>
            <p>
                We built Architect to provide a fun starting point for anyone exploring learning through puzzles.
                It is meant to be more fun than educational, but does provide an opportunity to work on spatial skills
                and working memory that can be valuable when trying to solve more educational puzzles.
            </p>
            <p>
                Architect was inspired by Tetris, but was changed to minimize the somewhat stressful aspect of increasingly
                fast falling blocks, making the game more about arranging the pieces to complete the puzzle then about the speed
                with which the pieces are dropping. Along these lines we also added in the pause feature and the ability to
                reorganize any piece at any time.
            </p>
            <p>
                Architect was also built for touchscreens, making the experience a little more tactile than the original Tetris.
                You actually have to grab and move pieces in order to position them.
            </p>
            <p>
                Again Architect is more for fun than our other educational puzzles. We do think there are some educational
                benefits such as developing spatial skills, but we are not promoting it as an educational puzzle.
            """
}]

LABDATA = [{
    id: 'language_scramble'
    title: 'Language Scramble'
    website: '/puzzles/language_scramble'
    thumbnail: '/assets/images/reviews/language_scramble.jpg'
    company: 'The Puzzle School'
    companyWebsite: 'http://puzzleschool.com'
    material: 'Foreign Languages'
    availability: 'Web, Mobile, Tablet'
    cost: 'Free'
    overall:
        rating: '4 Stars'
        explanation:
            """
            <p>Language Scramble is a simple puzzle meant to help people learn a new language (right now we just have Italian).</p>
            <p>
                You're presented with a foreign (in this case Italian) word and need to unscramble the letters to 
                form a correct translation in English.
            </p>
            <p>
                It's a little limited right now, focusing on traslation of written words, but has the potential
                to feature images and audio in the future. We're working to develop more levels and languages right now as well.
            </p>
            <p>
                It's also limited in its availability right now. Although it does work on iPhones and iPads, you have to have
                a connection to the internet for it to work, but we're working on fixing that as well.
            </p>
            """
    loveOfLearning:
        rating: 4
        explanation:
            """
            <p>Language Scramble makes learning a foreign language feel like a crossword puzzle. From our perspective that's a big win.</p>
            <p>
                In our user tests so far people of all ages have sat down with the game and solved dozens
                of puzzles with no prodding.
            </p>
            <p>
                The game doesn't quite make you feel like an expert (a native speaker), but it would be very difficult if not impossible
                to achieve that with language learning. It does however make learning a language feel like an enjoyable and engaging experience
                rather than hard work.
            </p>
            <p>
                I can't really say that a student will walk away from Language Scramble wanting to learn more about languages. So it's
                not really fostering a love of learning, but it is making learning that is usually very challenging more enjoyable.
            </p>
            """
    intuitive:
        rating: 5
        explanation:
            """
            <p>
                When tested on middle school students the students were able to engage with Language Scramble immediately with no
                explanation.
            </p>
            <p>
                We have seen some adults struggle with it a bit, but generally speaking most people are able to figure it out
                with little to no help. Also there is very little instruction in the game required to get going.
            </p>
            <p>Generally speaking Language Scramble is about intuitive as it gets.</p>
            """
    engagement:
        rating: 4
        explanation:
            """
                <p>
                    Although people seem to engage with Language Scramble right away and solve numerous puzzles with no encouragement
                    (the students we worked with used it for more than half an hour without any sign of boredom or distraction),
                    we generally are not seeing people come back time and time again to learn more.
                </p>
                <p>
                    This may be due, in part, to both the lack of levels (there are only 6 so far and only in Italian), and the lack of
                    accessibility. Even though the game is available on most smart phones through the web browser, it has not yet been finely
                    tuned to work on phones and is not available in any app store. So in order to come back you would need to type in the URL
                    and sign in to the site.
                </p>
                <p>
                    In the future we'll have more levels, more languages, and we'll be making it available in all app stores for easier
                    accessibility. Hopefully that will make it easier for people to reengage with the learning after the first experience.
                </p>
                <p>
                    For now, though, we're very happy to see people engaging with such a minimal app. There's no speed, no competition,
                    just the language learning content. The puzzle dynamics are solid and the feedback loops are tight with immediate
                    feedback each step of the way. We're a big fan of minimal apps that engage effectively without the use of a lot of
                    bells and whistles (badges, bright colors, exciting rewards, etc).
                </p>
            """
    practicality:
        rating: 4
        explanation:
            """
            <p>Although there's very little to Language Scramble than the languages involved, it still could improve a bit.</p>
            <p>
                To be truly practical as a language learning game we're going to need to have more than just written words to
                translate. Ideally there would be images and spoken words as well, providing a more complete experience of
                the foreign language.
            </p>
            <p>
                Still there are very few bells and whistles distracting from the language learning, so the learning is effective and
                very practical as is.
            <p>
            """
    accessibility:
        rating: 3
        explanation:
            """
            <p>There's still a lot more work to be done to make Language Scramble as accessible as it needs to be.</p>
            <p>
                Although it works well on a computer or through a web browser on an iPad or even the iPhone, it's not yet
                available through any app stores, and the web browser experience requires you to sign in, making it more
                difficult to access the app through your phone or iPad.
            </p>
            <p>
                The experience is also not yet optimized for small screens. So while it works well on an iPad, it leaves a little
                to be desired on a smart phone. It works, but the experience isn't all that great yet.
            </p>
            <p>We're hoping to improve all of this as soon as we can.</p>
            """
}, {
    id: 'light_it_up'
    title: 'Light It Up'
    website: '/puzzles/light_it_up'
    thumbnail: '/assets/images/reviews/light_it_up.jpg'
    company: 'The Puzzle School'
    companyWebsite: 'http://puzzleschool.com'
    material: 'Fractions'
    availability: 'Web, Mobile, Tablet'
    cost: 'Free'
    overall:
        explanation:
            """
            <p>
                Light It Up was inspired by the fractions game,
                <a href='/reviews'>Refraction</a>,
                developed by the University of Washington's Center for Game Science.
            </p>
            <p>
                While we loved Refraction, we wanted to make a few changes. 
            </p>
            <ul>
                <li>
                    We wanted to create puzzles that would teach students fractions more directly,
                    so we reduced the number of obstacles in our levels, making the puzzles more about the
                    fractions than the obstacles.
                </li>
                <li>
                    We created a <a href='/puzzles/light_it_up/editor' target='_blank'>level editor</a> 
                    that allows teachers to easily create custom levels to teach
                    a specific fraction-based idea. The level editor also allows students to create their own
                    puzzles, improving their mastery of fractions while creating puzzles as well as solving puzzles.
                </li>
                <li>
                    We wanted to add in a feature that would walk you through the solution to the puzzle if
                    you got stuck. We wanted to make the game more about learning then about solving the
                    puzzles, so we focused on creating more levels with the ability to get help on any level
                    that is too hard.
                </li>
                <li>
                    We wanted to be able to track students as they progress through levels so that we can
                    determine if a level is appropriately challenging and improve it if it is not. If you are
                    interested in using these tracking features (how long a student spends on a puzzle, how many
                    moves they make, whether they complete it or not), let us know.
                </li>
                <li>
                    We wanted to developer the program in html and javascript so that it could more easily
                    be ported to a native mobile application.
                </li>
            </ul>
            <p>
                Light It Up is still a work in progress, so beware that it may be buggy.
            </p>
            <p>
                You can try creating your own levels with the 
                <a href='/puzzles/light_it_up/editor' target='_blank'>Level Editor</a>.
                Just click on a block on the board to add pieces of your puzzle to the board.
            </p>
            """
}, {
    id: 'peanutty'
    title: 'Peanutty!'
    website: 'http://peanutty.org'
    thumbnail: 'http://peanutty.org/src/client/images/simple_bucket.jpg'
    company: 'The Puzzle School'
    companyWebsite: 'http://puzzleschool.com'
    material: 'Programming'
    availability: 'Web (Chrome only)'
    cost: 'Free'
    overall:
        rating: '3.2 Stars'
        explanation:
            """
            <p>
                Peanutty! is an experiment in teaching people how to code.
            </p>
            <p>
                People can solve physics-based puzzles sort of like Angry Birds, while watching their actions create code.
            </p>
            <p>
                Once people realize that their actions are creating code they can start to tweak the code and see what happens.
            </p>
            <p>
                Small tweaks lead to larger and larger tweaks until they are capable of designing their own Peanutty levels.
            </p>    
            <p>
                Unfortunately Peanutty! is still a little too hard for most people to engage with for long enough to truly learn 
                how to code, but we think it has the potential to become a great puzzle-like environment for learning to program.
            </p>
            """
    loveOfLearning:
        rating: 3
        explanation:
            """
            <p>
                Unforunately Peanutty! is still a bit too complicated for most students to engage with it beyond the first few
                challanges. We think it has the potential to be a great environment to learn programming, but it's not there yet.
            </p>
            <p>
                At this point I think it's too likely that a student would get overwhelmed and frustrated trying to use Peanutty!
                Some students may be able to figure it out and have a lot of fun with it, but too many may find it confusing, leading
                to a general sense that they're not good at programming. That's exactly what we would like to avoid.
            </p>
            <br/><br/>
            """
    intuitive:
        rating: 3
        explanation:
            """
            <p>
                Alhough Peanutty! has some fun techniques to make it intuitive with very little instruction (namely the ability to
                interact with the environment without coding, but having those interactions produce code), but it's still not nearly
                intuitive enough for prime time.
            </p>
            <p>
                As with the "love of learning" aspect, we hope to improve the intuitiveness of Peanutty! in the near future.
            </p>
            <br/><br/>
            """
    engagement:
        rating: 3
        explanation:
            """
            <p>
                Once again we think Peanutty! has a lot of potential in the engagement arena. Already in tests with high school students
                we've seen a high level of engagement. Unfortunately it rapidly diminished as the activities became too challenging
                too quickly.
            </p>
            <p>Once again we hope to improve this aspect of Peanutty! in the near future as well.</p>
            <br/><br/><br/>
            """
    practicality:
        rating: 5
        explanation:
            """
            <p>
                This is the one area where Peanutty! currently rates very highly. In order to solve problems and create levels in
                Peanutty! students write the same code that I use every day as a professional programmer. There's very little
                between the studens and actual coding. Maybe there should be some more layers of simplification, but as it is
                students get a very practical exposure to programming, how it looks, how to interact with it, etc.
            </p>
            <br/><br/><br/><br/>
            """
    accessibility:
        rating: 2
        explanation:
            """
            <p>
                Peanutty! currently scores pretty low here. It only works on the Chrome browser and isn't accessible on smart phones
                or tablets. Even worse, we're not sure that it's ever going to be accessible on those more mobile devices.
            </p>
            <p>
                The problem is that programming requires a fair amount of typing and we're not really sure that it's going to
                work well with a virtual keyboard. I certainly wouldn't want to program anything substantial on a virtual keyboard.
            </p>
            <p>
                Not only that, but we're not sure how to make it all work on a smaller screen. We want to make sure the environment and
                the code are both visible at all times so that it's easier to make and test changes. We might be able to squeeze it into a
                tablet format, but I doubt it will ever fit on a smart phone's screen.
            </p>
            <br/>
            """
}, {
    id: 'upside_down_academy'
    title: 'Upside Down Academy'
    website: 'http://upsidedownacademy.org'
    thumbnail: '/assets/images/reviews/upsidedownacademy.jpg'
    company: 'The Puzzle School'
    companyWebsite: 'http://puzzleschool.com'
    material: 'All Subjects'
    availability: 'Web'
    cost: 'Free'
    overall:
        explanation:
            """
            <p>Upside Down Academy isn't a puzzle in itself, but it can help turn any lesson in to a puzzle.</p>
            <p>
                The act of creating something is the ultimate puzzle. Trying to teach someone what ever you have just learned 
                forces you to take look at your learning from the puzzle perspective, analyzing it to figure out the patterns
                that will allow you to teach it to someone else.
            </p>
            <p>
                It takes advantage of the very effective 
                <a href='http://ideas.time.com/2011/11/30/the-protege-effect/' target='_blank'>"Protégé Effect"</a> 
                where teaching material to another person actually helps the teacher learn the material in a very effective manner.
            </p>
            <p>Upside Down Academy provides a place for people to post the lessons they've created where others can see and benefit from them.</p>        
            <p>
                At the end of the day, unfortunately it is unlikely that a student would choose to create a lesson on Upside Down
                Academy unless they are required to do so, which goes against one of the main tenants of The Puzzle School.
            </p>
            """
}]        
    