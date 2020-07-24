import { createNanoEvents, Emitter } from 'nanoevents'

export class Game {

    static WINNING_MOVES = {
        'paper': 'rock',
        'scissors': 'paper',
        'rock': 'scissors'
    }

    constructor() {
        this.player_score = 0
        this.computer_score = 0
        this._emitter = createNanoEvents()
    }

    /**
     * reset the game state
     */
    reset() {
        this.player_score = 0
        this.computer_score = 0
        this._emitter.emit("game:state:reset")
        this._emitter.emit("game:state:changed", this.currentGameState())
    }

    /**
     * check if the given move is valid or not
     * @param  {String} move the move to be checked
     * @returns {Boolean}
     */
    moveValid(move) {
        return Object.keys(Game.WINNING_MOVES).indexOf(move) !== -1
    }

    /**
     * updates the game stage based on the user's move and return the win state
     * @param  {('rock' | 'paper' | 'scissors')} player_move the playe's move
     * @returns {(-1,0,1)}
     *  -1 if computer wins
     *   0 if draw
     *   1 if player wins
     */
    play(player_move) {
        if (!this.moveValid(player_move)) {
            throw "Invalid Move Exception"
        }

        const computer_move = this.computerMove()
        const win = this.won(player_move, computer_move);

        if (win == 1) {
            this.player_score++
            this._emitter.emit("game:result:player_won")
        } else if (win == -1) {
            this.computer_score++
            this._emitter.emit("game:result:computer_won")
        } else {
            this._emitter.emit("game:result:draw")
        }
        this._emitter.emit("game:moved", { computer_move, player_move })
        this._emitter.emit("game:state:changed", this.currentGameState())
        return win
    }

    /**
     * compares the player_move and the computer_move to check who won
     * @param  {('rock' | 'paper' | 'scissors')} player_move the move player palyed
     * @param  {('rock' | 'paper' | 'scissors')} computer_move the move computer played
     *  @returns {(-1,0,1)}
     *  -1 if computer wins
     *   0 if draw
     *   1 if player wins
     */
    won(player_move, computer_move) {
        if (player_move == computer_move) return 0
        return Game.WINNING_MOVES[player_move] == computer_move ? 1 : -1
    }

    /**
     * return either rock, paper, or scissors based on a random probability
     * @return  {('rock' | 'paper' | 'scissors')}
     */
    computerMove() {
        const computerChoice = Math.random();
        switch (this._getRandomInt()) {
            case 1:
                return "rock";
            case 2:
                return "paper";
            case 3:
                return "scissors";
        }
    }

    /**
     * return a random number between 1 to 3 ( inclusive )
     * @returns {(1,2,3)}
     */
    _getRandomInt() {
        return Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    }
    /**
     * return current game state
     * @returns { { player_score: {Integer}, computer_score: {Integer} } }
     */
    currentGameState() {
        return {
            player_score: this.player_score,
            computer_score: this.computer_score
        }
    }

    /**
     *  return an event emmiter
     *  @returns { Emitter }
     *  emiiter events 
     *      1. game:state:reset -> when the game states are resetted
     *      2. game:state:changed -> when the game state changes
     *      3. game:result:player_won -> when the player wins
     *      4. game:result:computer_won -> when the player wins
     *      5. game:result:draw -> when match is a draw
     *      6. game:moved -> when both players have made a move
     */
    emitter() {
        return this._emitter;
    }


}