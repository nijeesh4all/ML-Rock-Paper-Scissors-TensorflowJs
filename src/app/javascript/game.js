module.exports = class Game {

    static WINNING_MOVES = {
        'paper': 'rock',
        'scissors': 'paper',
        'rock': 'scissors'
    }

    constructor(callbacks) {
        this.player_score = 0
        this.computer_score = 0
        this.callbacks = callbacks;
    }

    /**
     * reset the game state
     */
    reset() {
        this.player_score = 0
        this.computer_score = 0
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
            this.callbacks.result.player()
        } else if (win == -1) {
            this.computer_score++
            this.callbacks.result.computer()
        } else {
            this.callbacks.result.draw()
        }
        this.callbacks.move.show_move(computer_move, player_move);
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

}