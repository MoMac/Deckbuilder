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


    //HAND
    globals.handArea = this.add.zone(450, 510, 700, 120).setRectangleDropZone(700, 120);
    globals.handArea._type = 'hand';
    //  Just a visual display of the drop zone
    this.add.graphics().lineStyle(2, 0xffff00).strokeRect(globals.handArea.x + globals.handArea.input.hitArea.x, globals.handArea.y + globals.handArea.input.hitArea.y, globals.handArea.input.hitArea.width, globals.handArea.input.hitArea.height);

    //MANA
    globals.manaArea = this.add.zone(450, 370, 700, 120).setRectangleDropZone(700, 120);
    globals.manaArea._type = 'mana';
    //  Just a visual display of the drop zone
    this.add.graphics().lineStyle(2, 0xffff00).strokeRect(globals.manaArea.x + globals.manaArea.input.hitArea.x, globals.manaArea.y + globals.manaArea.input.hitArea.y, globals.manaArea.input.hitArea.width, globals.manaArea.input.hitArea.height);

    //DEFENDERS
    globals.defenderArea = this.add.zone(450, 230, 700, 120).setRectangleDropZone(700, 120);
    globals.defenderArea._type = 'defender';
    //  Just a visual display of the drop zone
    this.add.graphics().lineStyle(2, 0xffff00).strokeRect(globals.defenderArea.x + globals.defenderArea.input.hitArea.x, globals.defenderArea.y + globals.defenderArea.input.hitArea.y, globals.defenderArea.input.hitArea.width, globals.defenderArea.input.hitArea.height);

    //ATTACKERS
    globals.attackerArea = this.add.zone(450, 90, 700, 120).setRectangleDropZone(700, 120);
    globals.attackerArea._type = 'attacker';
    //  Just a visual display of the drop zone
    this.add.graphics().lineStyle(2, 0xffff00).strokeRect(globals.attackerArea.x + globals.attackerArea.input.hitArea.x, globals.attackerArea.y + globals.attackerArea.input.hitArea.y, globals.attackerArea.input.hitArea.width, globals.attackerArea.input.hitArea.height);

    globals.deck = [];

    makeDeck(this);
    globals.deck = shuffleDeck(globals.deck);

    globals.cards = {
        hand: [],
        defender: [],
        attacker: [],
        mana: []
    };

    for (let i = 0; i < 6; i++) {
        drawCard(this);
    }
    
    this.input.on('dragstart', function(pointer, gameObject) {
        globals.prevX = gameObject.x;
        globals.prevY = gameObject.y;
    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.input.on('dragend', function (pointer, gameObject) {
        const cardType = gameObject._type;
        const zone = globals[cardType + "Area"];

        if (zone.getBounds().contains(pointer.x, pointer.y)) {
            setCardPosition(gameObject, globals.cards[cardType], zone);
            globals.cards[cardType].push(gameObject);
            gameObject.setScale(1).removeInteractive();
        }
        else {
            gameObject.x = globals.prevX;
            gameObject.y = globals.prevY;
        }
    });
}

function makeDeck (game) {

    for (let i = 0; i < 4; i++) {
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
    let drawnCard = game.add.image(0, 0, topCard._img).setInteractive().on('pointerover', function (event) {
        game.children.bringToTop(drawnCard);
        this.setScale(1.3);
    }).on('pointerout', function (event) {
        this.setScale(1);
    });

    setCardPosition(drawnCard, globals.cards.hand, globals.handArea);

    game.input.setDraggable(drawnCard);

    Object.assign(drawnCard, topCard);
    globals.deck.shift();
    globals.cards.hand.push(drawnCard);
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
