// Generated by CoffeeScript 1.3.3
var LABDATA, PUZZLEDATA, soma, wings;

soma = require('soma');

wings = require('wings');

soma.chunks({
  Puzzles: {
    meta: function() {
      return new soma.chunks.Base({
        content: this
      });
    },
    prepare: function(_arg) {
      _arg;
      return this.template = this.loadTemplate('/build/common/templates/puzzles.html');
    },
    build: function() {
      this.setTitle("Puzzles - The Puzzle School");
      return this.html = wings.renderTemplate(this.template, {
        puzzles: PUZZLEDATA,
        labs: LABDATA
      });
    }
  }
});

soma.views({
  Puzzles: {
    selector: '#content .puzzles',
    create: function() {
      var _this = this;
      $('.register_flag').hide();
      return this.$('.rating p').bind('click', function(e) {
        return _this.showSection(e.currentTarget);
      });
    },
    showSection: function(navElement) {
      var selected;
      this.$('.rating p.selected').removeClass('selected');
      selected = navElement.className.replace(/\s/ig, '');
      $(navElement).addClass('selected');
      this.$('.explanation.selected').removeClass('selected');
      return this.$(".explanation." + selected).addClass('selected');
    }
  }
});

soma.routes({
  '/labs': function() {
    return new soma.chunks.Puzzles;
  },
  '/puzzles': function() {
    return new soma.chunks.Puzzles;
  }
});

PUZZLEDATA = [
  {
    id: 'architect',
    title: 'Architect',
    website: '/puzzles/architect',
    thumbnail: '/assets/images/reviews/architect.jpg',
    company: 'The Puzzle School',
    companyWebsite: 'http://puzzleschool.com',
    material: 'Spatial Skills',
    availability: 'Mobile, Tablet',
    cost: '$0.99',
    overall: {
      explanation: "<p>\n    Architect is not an educational puzzle. It can help develop spatial skills, which have been shown to\n    <a href='http://medicalxpress.com/news/2012-07-spatial-skills.html' target='_blank'>improve performance in STEM subjects</a>,\n    but does not approach any other educational material.\n</p>\n<p>\n    We built Architect to provide a fun starting point for anyone exploring learning through puzzles.\n    It is meant to be more fun than educational, but does provide an opportunity to work on spatial skills\n    and working memory that can be valuable when trying to solve more educational puzzles.\n</p>\n<p>\n    Architect was inspired by Tetris, but was changed to minimize the somewhat stressful aspect of increasingly\n    fast falling blocks, making the game more about arranging the pieces to complete the puzzle then about the speed\n    with which the pieces are dropping. Along these lines we also added in the pause feature and the ability to\n    reorganize any piece at any time.\n</p>\n<p>\n    Architect was also built for touchscreens, making the experience a little more tactile than the original Tetris.\n    You actually have to grab and move pieces in order to position them.\n</p>\n<p>\n    Again Architect is more for fun than our other educational puzzles. We do think there are some educational\n    benefits such as developing spatial skills, but we are not promoting it as an educational puzzle."
    }
  }
];

LABDATA = [
  {
    id: 'language_scramble',
    title: 'Language Scramble',
    website: '/puzzles/language_scramble',
    thumbnail: '/assets/images/reviews/language_scramble.jpg',
    company: 'The Puzzle School',
    companyWebsite: 'http://puzzleschool.com',
    material: 'Foreign Languages',
    availability: 'Web, Mobile, Tablet',
    cost: 'Free',
    overall: {
      rating: '4 Stars',
      explanation: "<p>Language Scramble is a simple puzzle meant to help people learn a new language (right now we just have Italian).</p>\n<p>\n    You're presented with a foreign (in this case Italian) word and need to unscramble the letters to \n    form a correct translation in English.\n</p>\n<p>\n    It's a little limited right now, focusing on traslation of written words, but has the potential\n    to feature images and audio in the future. We're working to develop more levels and languages right now as well.\n</p>\n<p>\n    It's also limited in its availability right now. Although it does work on iPhones and iPads, you have to have\n    a connection to the internet for it to work, but we're working on fixing that as well.\n</p>"
    },
    loveOfLearning: {
      rating: 4,
      explanation: "<p>Language Scramble makes learning a foreign language feel like a crossword puzzle. From our perspective that's a big win.</p>\n<p>\n    In our user tests so far people of all ages have sat down with the game and solved dozens\n    of puzzles with no prodding.\n</p>\n<p>\n    The game doesn't quite make you feel like an expert (a native speaker), but it would be very difficult if not impossible\n    to achieve that with language learning. It does however make learning a language feel like an enjoyable and engaging experience\n    rather than hard work.\n</p>\n<p>\n    I can't really say that a student will walk away from Language Scramble wanting to learn more about languages. So it's\n    not really fostering a love of learning, but it is making learning that is usually very challenging more enjoyable.\n</p>"
    },
    intuitive: {
      rating: 5,
      explanation: "<p>\n    When tested on middle school students the students were able to engage with Language Scramble immediately with no\n    explanation.\n</p>\n<p>\n    We have seen some adults struggle with it a bit, but generally speaking most people are able to figure it out\n    with little to no help. Also there is very little instruction in the game required to get going.\n</p>\n<p>Generally speaking Language Scramble is about intuitive as it gets.</p>"
    },
    engagement: {
      rating: 4,
      explanation: "<p>\n    Although people seem to engage with Language Scramble right away and solve numerous puzzles with no encouragement\n    (the students we worked with used it for more than half an hour without any sign of boredom or distraction),\n    we generally are not seeing people come back time and time again to learn more.\n</p>\n<p>\n    This may be due, in part, to both the lack of levels (there are only 6 so far and only in Italian), and the lack of\n    accessibility. Even though the game is available on most smart phones through the web browser, it has not yet been finely\n    tuned to work on phones and is not available in any app store. So in order to come back you would need to type in the URL\n    and sign in to the site.\n</p>\n<p>\n    In the future we'll have more levels, more languages, and we'll be making it available in all app stores for easier\n    accessibility. Hopefully that will make it easier for people to reengage with the learning after the first experience.\n</p>\n<p>\n    For now, though, we're very happy to see people engaging with such a minimal app. There's no speed, no competition,\n    just the language learning content. The puzzle dynamics are solid and the feedback loops are tight with immediate\n    feedback each step of the way. We're a big fan of minimal apps that engage effectively without the use of a lot of\n    bells and whistles (badges, bright colors, exciting rewards, etc).\n</p>"
    },
    practicality: {
      rating: 4,
      explanation: "<p>Although there's very little to Language Scramble than the languages involved, it still could improve a bit.</p>\n<p>\n    To be truly practical as a language learning game we're going to need to have more than just written words to\n    translate. Ideally there would be images and spoken words as well, providing a more complete experience of\n    the foreign language.\n</p>\n<p>\n    Still there are very few bells and whistles distracting from the language learning, so the learning is effective and\n    very practical as is.\n<p>"
    },
    accessibility: {
      rating: 3,
      explanation: "<p>There's still a lot more work to be done to make Language Scramble as accessible as it needs to be.</p>\n<p>\n    Although it works well on a computer or through a web browser on an iPad or even the iPhone, it's not yet\n    available through any app stores, and the web browser experience requires you to sign in, making it more\n    difficult to access the app through your phone or iPad.\n</p>\n<p>\n    The experience is also not yet optimized for small screens. So while it works well on an iPad, it leaves a little\n    to be desired on a smart phone. It works, but the experience isn't all that great yet.\n</p>\n<p>We're hoping to improve all of this as soon as we can.</p>"
    }
  }, {
    id: 'light_it_up',
    title: 'Light It Up',
    website: '/puzzles/light_it_up',
    thumbnail: '/assets/images/reviews/light_it_up.jpg',
    company: 'The Puzzle School',
    companyWebsite: 'http://puzzleschool.com',
    material: 'Fractions',
    availability: 'Web, Mobile, Tablet',
    cost: 'Free',
    overall: {
      explanation: "<p>\n    Light It Up was inspired by the fractions game,\n    <a href='/reviews'>Refraction</a>,\n    developed by the University of Washington's Center for Game Science.\n</p>\n<p>\n    While we loved Refraction, we wanted to make a few changes. \n</p>\n<ul>\n    <li>\n        We wanted to create puzzles that would teach students fractions more directly,\n        so we reduced the number of obstacles in our levels, making the puzzles more about the\n        fractions than the obstacles.\n    </li>\n    <li>\n        We created a <a href='/puzzles/light_it_up/editor' target='_blank'>level editor</a> \n        that allows teachers to easily create custom levels to teach\n        a specific fraction-based idea. The level editor also allows students to create their own\n        puzzles, improving their mastery of fractions while creating puzzles as well as solving puzzles.\n    </li>\n    <li>\n        We wanted to add in a feature that would walk you through the solution to the puzzle if\n        you got stuck. We wanted to make the game more about learning then about solving the\n        puzzles, so we focused on creating more levels with the ability to get help on any level\n        that is too hard.\n    </li>\n    <li>\n        We wanted to be able to track students as they progress through levels so that we can\n        determine if a level is appropriately challenging and improve it if it is not. If you are\n        interested in using these tracking features (how long a student spends on a puzzle, how many\n        moves they make, whether they complete it or not), let us know.\n    </li>\n    <li>\n        We wanted to developer the program in html and javascript so that it could more easily\n        be ported to a native mobile application.\n    </li>\n</ul>\n<p>\n    Light It Up is still a work in progress, so beware that it may be buggy.\n</p>\n<p>\n    You can try creating your own levels with the \n    <a href='/puzzles/light_it_up/editor' target='_blank'>Level Editor</a>.\n    Just click on a block on the board to add pieces of your puzzle to the board.\n</p>"
    }
  }, {
    id: 'peanutty',
    title: 'Peanutty!',
    website: 'http://peanutty.org',
    thumbnail: 'http://peanutty.org/src/client/images/simple_bucket.jpg',
    company: 'The Puzzle School',
    companyWebsite: 'http://puzzleschool.com',
    material: 'Programming',
    availability: 'Web (Chrome only)',
    cost: 'Free',
    overall: {
      rating: '3.2 Stars',
      explanation: "<p>\n    Peanutty! is an experiment in teaching people how to code.\n</p>\n<p>\n    People can solve physics-based puzzles sort of like Angry Birds, while watching their actions create code.\n</p>\n<p>\n    Once people realize that their actions are creating code they can start to tweak the code and see what happens.\n</p>\n<p>\n    Small tweaks lead to larger and larger tweaks until they are capable of designing their own Peanutty levels.\n</p>    \n<p>\n    Unfortunately Peanutty! is still a little too hard for most people to engage with for long enough to truly learn \n    how to code, but we think it has the potential to become a great puzzle-like environment for learning to program.\n</p>"
    },
    loveOfLearning: {
      rating: 3,
      explanation: "<p>\n    Unforunately Peanutty! is still a bit too complicated for most students to engage with it beyond the first few\n    challanges. We think it has the potential to be a great environment to learn programming, but it's not there yet.\n</p>\n<p>\n    At this point I think it's too likely that a student would get overwhelmed and frustrated trying to use Peanutty!\n    Some students may be able to figure it out and have a lot of fun with it, but too many may find it confusing, leading\n    to a general sense that they're not good at programming. That's exactly what we would like to avoid.\n</p>\n<br/><br/>"
    },
    intuitive: {
      rating: 3,
      explanation: "<p>\n    Alhough Peanutty! has some fun techniques to make it intuitive with very little instruction (namely the ability to\n    interact with the environment without coding, but having those interactions produce code), but it's still not nearly\n    intuitive enough for prime time.\n</p>\n<p>\n    As with the \"love of learning\" aspect, we hope to improve the intuitiveness of Peanutty! in the near future.\n</p>\n<br/><br/>"
    },
    engagement: {
      rating: 3,
      explanation: "<p>\n    Once again we think Peanutty! has a lot of potential in the engagement arena. Already in tests with high school students\n    we've seen a high level of engagement. Unfortunately it rapidly diminished as the activities became too challenging\n    too quickly.\n</p>\n<p>Once again we hope to improve this aspect of Peanutty! in the near future as well.</p>\n<br/><br/><br/>"
    },
    practicality: {
      rating: 5,
      explanation: "<p>\n    This is the one area where Peanutty! currently rates very highly. In order to solve problems and create levels in\n    Peanutty! students write the same code that I use every day as a professional programmer. There's very little\n    between the studens and actual coding. Maybe there should be some more layers of simplification, but as it is\n    students get a very practical exposure to programming, how it looks, how to interact with it, etc.\n</p>\n<br/><br/><br/><br/>"
    },
    accessibility: {
      rating: 2,
      explanation: "<p>\n    Peanutty! currently scores pretty low here. It only works on the Chrome browser and isn't accessible on smart phones\n    or tablets. Even worse, we're not sure that it's ever going to be accessible on those more mobile devices.\n</p>\n<p>\n    The problem is that programming requires a fair amount of typing and we're not really sure that it's going to\n    work well with a virtual keyboard. I certainly wouldn't want to program anything substantial on a virtual keyboard.\n</p>\n<p>\n    Not only that, but we're not sure how to make it all work on a smaller screen. We want to make sure the environment and\n    the code are both visible at all times so that it's easier to make and test changes. We might be able to squeeze it into a\n    tablet format, but I doubt it will ever fit on a smart phone's screen.\n</p>\n<br/>"
    }
  }, {
    id: 'upside_down_academy',
    title: 'Upside Down Academy',
    website: 'http://upsidedownacademy.org',
    thumbnail: '/assets/images/reviews/upsidedownacademy.jpg',
    company: 'The Puzzle School',
    companyWebsite: 'http://puzzleschool.com',
    material: 'All Subjects',
    availability: 'Web',
    cost: 'Free',
    overall: {
      explanation: "<p>Upside Down Academy isn't a puzzle in itself, but it can help turn any lesson in to a puzzle.</p>\n<p>\n    The act of creating something is the ultimate puzzle. Trying to teach someone what ever you have just learned \n    forces you to take look at your learning from the puzzle perspective, analyzing it to figure out the patterns\n    that will allow you to teach it to someone else.\n</p>\n<p>\n    It takes advantage of the very effective \n    <a href='http://ideas.time.com/2011/11/30/the-protege-effect/' target='_blank'>\"Protégé Effect\"</a> \n    where teaching material to another person actually helps the teacher learn the material in a very effective manner.\n</p>\n<p>Upside Down Academy provides a place for people to post the lessons they've created where others can see and benefit from them.</p>        \n<p>\n    At the end of the day, unfortunately it is unlikely that a student would choose to create a lesson on Upside Down\n    Academy unless they are required to do so, which goes against one of the main tenants of The Puzzle School.\n</p>"
    }
  }
];
