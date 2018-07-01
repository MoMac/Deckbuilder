import 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 576,
    scene: {
        preload: preload,
        create: create
    },
    title: 'Deckbuilder'
};

let globals = {};

const game = new Phaser.Game(config);

function preload () {
    this.load.image('cardback', 'assets/cardback.png');
    this.load.image('attack', 'assets/sword.png');
    this.load.image('defense', 'assets/shield.png');
    this.load.image('mana', 'assets/mana.png');
}

function create () {

    // globals.handArea = this.add.graphics();
    // globals.handArea.fillStyle(0xffffff);
    // globals.handArea.fillRect(100, 450, 700, 120);

    globals.handArea = this.add.zone(450, 510).setRectangleDropZone(700, 120);

    //  Just a visual display of the drop zone
    let handRect = this.add.graphics();
    handRect.lineStyle(2, 0xffff00);
    handRect.strokeRect(globals.handArea.x + globals.handArea.input.hitArea.x, globals.handArea.y + globals.handArea.input.hitArea.y, globals.handArea.input.hitArea.width, globals.handArea.input.hitArea.height);

    globals.deck = [];

    makeDeck(this);
    globals.deck = shuffleDeck(globals.deck);

    globals.hand = [];

    for (let i = 0; i < 6; i++) {
        drawCard(this);
    }
        
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    // this.input.on('drop', function (pointer, gameObject, dropZone) {
    //     gameObject.x = dropZone.x;
    //     gameObject.y = dropZone.y;
    // });
}

function makeDeck (game) {

    for (let i = 0; i < 5; i++) {
        globals.deck.push({
            _type: 'mana',
            _img: 'mana',
            _value: 1,
            _cost: 0
        });
    }

    for (let i = 0; i < 7; i++) {
        globals.deck.push({
            _type: 'defender',
            _img: 'defense',
            _value: 2,
            _cost: 1
        });
    }

    for (let i = 0; i < 4; i++) {
        globals.deck.push({
            _type: 'attacker',
            _img: 'attack',
            _value: 1,
            _cost: 1
        });
    }

    let deck = game.add.image(0, 0, 'cardback').setOrigin(1).setScale(.35,.35);
    deck.x = config.width-5;
    deck.y = config.height-5;
}

function drawCard (game) {
    const topCard = globals.deck[0];
    let drawnCard = game.add.image(0, 0, topCard._img).setInteractive();

    setCardPosition(drawnCard, globals.hand, globals.handArea);

    game.input.setDraggable(drawnCard);

    Object.assign(drawnCard, topCard);
    globals.deck.shift();
    globals.hand.push(drawnCard);
}

function setCardPosition (newCard, cards, dropZone) {
    let pos = {
        x: dropZone.x,
        y: dropZone.y
    };

    for (let i = 0; i < cards.length; i++) {
        cards[i].x -= cards[i].width/2 + 5;
        pos.x += cards[i].width/2 + 5;
    }

    newCard.x = pos.x;
    newCard.y = pos.y;
}

function shuffleDeck (array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
