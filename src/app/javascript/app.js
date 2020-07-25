import { show_count_down_timer, show_message, sleep } from './helpers';
import { init, loadModels, setupWebcam, playerMove } from './detect';
import { Game } from './game';

async function App() {

    const $computer_move_image = document.getElementById('computer_move_image')
    const $player_move_image = document.getElementById('player_move_image')
    const $computer_move_text = document.getElementById('computer_move_text')
    const $player_move_text = document.getElementById('player_move_text')
    const $start_game_button = document.getElementById('start_game_button')
    const $splash_screen = document.getElementById('initail-loading-screen')
    const $webcamContainer = document.getElementById('content1')
    const $reset_game_button = document.getElementById('reset_game_button')

    const game = new Game();


    /**
     * Changes start button text and disbaled attribute
     * @param  {String} text text to be displayed on the start button
     * @param  {Boolean} disabled=false should disable the button
     * @returns {undefined}
     */
    const changeStartingButtonState = function (text, disabled = false) {
        $start_game_button.innerHTML = text;
        $start_game_button.disabled = disabled;
    }

    /**
     * shows playe's and computer's move on the screen
     * @param  {} {computer_move compuet's move
     * @param  {} player_move} player's move
     *  @returns {undefined}
     */
    const show_move = ({ computer_move, player_move }) => {
        $computer_move_image.classList.remove('rock', 'paper', 'scissors');
        if (computer_move.length != 0) {
            $computer_move_image.classList.add(computer_move);
        }
        $computer_move_text.innerText = computer_move;

        $player_move_image.classList.remove('rock', 'paper', 'scissors');
        if (player_move.length != 0) {
            $player_move_image.classList.add(player_move);
        }
        $player_move_text.innerText = player_move;
    }


    /**
     * playes a round of the game and starts a new game after 1 secods
     */
    const play_round = async () => {
        // shows a countdown for 5 seconds 
        await show_count_down_timer(5)

        const player_move = await playerMove()

        if (player_move == 'blank') {
            show_message("Please Make a move");
        } else {
            game.play(player_move)
        }

        // restart the game after 1 second of waiting 
        await sleep(1)
        play_round()
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    changeStartingButtonState('PLEASE WAIT WHILE MODALS ARE BEING DOWNLOADED.....', true)

    // Load the tensorflow models 
    await loadModels()

    changeStartingButtonState('Start Game')

    $start_game_button.addEventListener('click', async () => {

        changeStartingButtonState('Please Allow Webcam Access.....', true)
        await setupWebcam($webcamContainer)

        $splash_screen.classList.add('d-none');

        // Init the webcam and camera updation
        init();

        await sleep(1);

        show_move({ computer_move: '', player_move: '' });

        play_round()

    })


    // reloads the page when reset game button is clicked
    $reset_game_button.addEventListener('click', window.location.reload)


    const game_emitter = game.emitter();

    /*
     * Shows playes and computers move
     *  
     */

    game_emitter.on('game:moved', show_move)

    /*
     * Shows a message based on who won
     *  
     */

    game_emitter.on('game:result:player_won', () => show_message("You Won"))
    game_emitter.on('game:result:computer_won', () => show_message("You Lost"))
    game_emitter.on('game:result:draw', () => show_message("Draw"))

    /*
     * Displayes the current score
     *  
     */

    const $user_score = document.getElementById('user-score')
    const $computer_score = document.getElementById('computer-score')

    game_emitter.on('game:state:changed', ({ player_score, computer_score }) => {
        $user_score.innerHTML = player_score
        $computer_score.innerHTML = computer_score
    })

}



export { App };