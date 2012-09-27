describe("Touch", function() {
    var game;

    beforeEach(function() {
        languageScramble.data = {
            english_italian: { 
                levels: {
                    top10words: {
                        data: [
                            {native: 'not', foreign: 'non', nativeSentence: 'that\'s not necessary', foreignSentence: 'non è necessario'},
                        ]
                    }
                }
            }
        }

        game = new languageScramble.ViewHelper({
            el: $('.language_scramble'),
            puzzleData: {levels: {'english_italian': {}}},
            languages: 'english_italian',
            saveProgress: function() {},
            maxLevel: 5
        })
        
        game.setLevel('top10words');         
        game.newScramble();        
    });
    
    describe("moving mouse", function() {
        it("should not move any letters unless mouse/touch down first", function () {
            var letter = $('.scrambled .letter');
            var letterX = letter.offset().left;
            triggerTouch(letter[0], 'move', letterX + 1, letter.offset().top);
            triggerTouch(letter[0], 'move', letterX + 2, letter.offset().top);
            triggerTouch(letter[0], 'move', letterX + 3, letter.offset().top);
            expect(letter.offset().left).toEqual(letterX);
        });
    });
    
    describe("with a letter", function() {
        var letter;
        var letterHtml;
        beforeEach(function() {
            letter = $('.scrambled .letter');
            letterHtml = letter.html();
            triggerTouch(letter[0], 'start', letter.offset().left, letter.offset().top);
        });

        it("should be a single letter", function() {
            expect(letterHtml.length).toEqual(1);
        })
        
        describe("clicking", function() {
            beforeEach(function() {
                triggerTouch(letter[0], 'end', letter.offset().left, letter.offset().top);
            });
            
            it("should jump to the first open guess", function() {
                var guess = $($('.guesses .letter')[0]);
                expect(guess.html()).toEqual(letterHtml);
            })

            it("should jump back if clicked again", function() {
                var guess = $($('.guesses .letter')[0]);
                var guessHtml = guess.html();
                triggerTouch(guess[0], 'start', guess.offset().left, guess.offset().top);
                triggerTouch(guess[0], 'end');
                expect($('.guesses .letter').length).toEqual(0);
                expect($($('.scrambled .letter')[0]).html()).toEqual(guessHtml);
            })
        });

        describe("dragging a bit", function() {
            beforeEach(function() {
                triggerTouch(letter[0], 'move', letter.offset().left - 5, letter.offset().top - 5);
                triggerTouch(letter[0], 'move', letter.offset().left - 10, letter.offset().top - 10);
                triggerTouch(letter[0], 'move', letter.offset().left - 15, letter.offset().top - 15);
                triggerTouch(letter[0], 'end');
            });
            
            it("should jump to the first open guess", function() {
                var guess = $($('.guesses .letter')[0]);
                expect(guess.html()).toEqual(letterHtml);
            })

            it("should jump back if dragged a little again", function() {
                var guess = $($('.guesses .letter')[0]);
                var guessHtml = guess.html();

                triggerTouch(guess[0], 'start', guess.offset().left, guess.offset().top);
                triggerTouch(guess[0], 'move', guess.offset().left - 5, guess.offset().top - 5);
                triggerTouch(guess[0], 'move', guess.offset().left - 10, guess.offset().top - 10);
                triggerTouch(guess[0], 'move', guess.offset().left - 15, guess.offset().top - 15);
                triggerTouch(guess[0], 'end');
                expect($('.guesses .letter').length).toEqual(0);
                expect($($('.scrambled .letter')[0]).html()).toEqual(guessHtml);
            })

            it("should jump back if dragged a little toward another guess", function() {
                var guess = $($('.guesses .letter')[0]);
                var guessHtml = guess.html();
                
                triggerTouch(guess[0], 'start', guess.offset().left, guess.offset().top);
                triggerTouch(guess[0], 'move', guess.offset().left + 5, guess.offset().top + 0);
                triggerTouch(guess[0], 'move', guess.offset().left + 10, guess.offset().top + 1);
                triggerTouch(guess[0], 'move', guess.offset().left + 15, guess.offset().top + 2);
                triggerTouch(guess[0], 'end');
                expect($('.guesses .letter').length).toEqual(0);
                expect($($('.scrambled .letter')[0]).html()).toEqual(guessHtml);
            })
        });
        
        describe("dragging to the second guess", function() {
            beforeEach(function() {
                var guess = $($('.guesses .guess')[1]);
                expect(guess.hasClass('actual_letter_o')).toBe(true);
                triggerTouch(letter[0], 'move', letter.offset().left + 5, letter.offset().top - 10);
                triggerTouch(letter[0], 'move', guess.offset().left - 10, guess.offset().top + 30);
                triggerTouch(letter[0], 'move', guess.offset().left + 1, guess.offset().top + 1);
                triggerTouch(letter[0], 'end');
            });
            
            it("should replace the guess", function() {
                var guessLetter = $($('.guesses .letter')[0]);
                expect(guessLetter.html()).toEqual(letterHtml);
                expect(guessLetter.hasClass('actual_letter_o')).toBe(true);
            })

            it("should move to another guess if dragged toward that guess", function() {
                var guessLetter = $($('.guesses .letter')[0]);
                var nextGuess  = $($('.guesses .guess')[1]);    
                expect(nextGuess.hasClass('actual_letter_t')).toBe(true);

                triggerTouch(guessLetter[0], 'start', guessLetter.offset().left, guessLetter.offset().top);
                triggerTouch(guessLetter[0], 'move', guessLetter.offset().left + 5, guessLetter.offset().top + 5);
                triggerTouch(guessLetter[0], 'move', nextGuess.offset().left - 5, nextGuess.offset().top + 5);
                triggerTouch(guessLetter[0], 'move', nextGuess.offset().left, nextGuess.offset().top + 5);
                triggerTouch(guessLetter[0], 'move', nextGuess.offset().left + 5, nextGuess.offset().top + 5);
                triggerTouch(guessLetter[0], 'end');

                expect(guessLetter.html()).toEqual(letterHtml);
                expect(guessLetter.hasClass('actual_letter_t')).toBe(true);
            })

            it("should jump back if dragged a little toward another guess", function() {
                var guess = $($('.guesses .letter')[0]);
                var guessHtml = guess.html();
                
                triggerTouch(guess[0], 'start', guess.offset().left, guess.offset().top);
                triggerTouch(guess[0], 'move', guess.offset().left + 5, guess.offset().top + 1);
                triggerTouch(guess[0], 'move', guess.offset().left + 10, guess.offset().top + 2);
                triggerTouch(guess[0], 'end', guess.offset().left + 15, guess.offset().top + 3);
                expect($('.guesses .letter').length).toEqual(0);
                expect($($('.scrambled .letter')[0]).html()).toEqual(guessHtml);
            })
        });
    });    
});