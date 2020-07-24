/*
 * Shows a message by appening it to dom and removing it after 200ms
 *  
 */

const show_message = async (message) => {
    const div = document.createElement('div')
    div.classList.add('flash-splash-message', 'background-primary')

    const h2 = document.createElement('h2')
    h2.classList.add('text-primary')

    h2.innerText = message
    div.appendChild(h2)

    await sleep(0.2)

    document.body.appendChild(div)

    await sleep(0.5)
    div.remove()
}

// simple promise to wait a secified number of secods

const sleep = async (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, 1000 * time)
    })
}


// Shows a countdown timer for specified seconds 

const show_count_down_timer = async (time) => {

    const div = document.createElement('div')
    div.classList.add('flash-splash-message', 'background-primary')

    const h2 = document.createElement('h2')
    h2.classList.add('text-primary')
    div.appendChild(h2)
    h2.innerText = "Ready"

    document.body.appendChild(div)


    let count_down = time - 1

    return new Promise((resolve, reject) => {

        const interval = setInterval(() => {
            h2.innerText = --count_down
            if (count_down == 0) {
                h2.innerText = 'Now'
            }
            if (count_down == -1) {
                div.remove();
                clearInterval(interval);
                resolve()
            }
        }, 1000)
    })

}

export {
    show_count_down_timer,
    sleep,
    show_message
}