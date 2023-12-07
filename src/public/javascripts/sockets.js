const socket = io()

const user = document.getElementById('name').innerHTML
const l_online = document.getElementById('user').innerHTML
const u_online = document.getElementById('users_online')
const hed = document.getElementById('hed')
const chat_window = document.getElementById('chat_window')
const chat_input = document.getElementById('chat_input')
const send_button = document.getElementById('send')
let favorite = ''
const symbol_input = document.getElementById('symbol_input')
let stocks= document.getElementById('stocks')
const send_Symbol = document.getElementById('sendSymbol')

// Users online count
socket.emit('online',{
    u_online: u_online.innerHTML
})

socket.on('users',(us)=>{
    u_online.innerHTML = `online: ${us.u_online}`

})

// last user that entered

socket.emit('last_online',{
    l_online: l_online
})

// Send messaje

const send = ()=>{
    if(chat_input.value.length >= 1){
        socket.emit('messaje',{
            chat_input: chat_input.value,
            user: user
        })

        chat_input.value = ''
        hed.innerHTML = l_online
    }
}

send_button.addEventListener('click',()=>{
   send()
})

socket.on('send_messaje',(ms)=>{

    chat_window.innerHTML += `
    <div> 
        <div id='messaje'>
            <p class='u_messaje'>
                <strong class='u_name'>${ms.user}:</strong> ${ms.chat_input}
            </p>
        </div>
    </div>
    `
})

// User typing

const type = () =>{
    chat_input.addEventListener('keypress', ()=>{
        if(chat_input.value.length > 1){
            socket.emit('u_typing', l_online)
        }
        if (event.key === 'Enter') {
           send()
        }
    })

    socket.on('typing',(use)=>{
        hed.innerHTML = `${use} is typing . . .`

        setTimeout(() => {
            hed.innerHTML = l_online
        }, 5000);
    })
}

type()

// User entered

socket.on('last',(ls)=>{
    document.getElementById('user').innerHTML = `<img class='usx' src="images/user_RobertHunt.jpg"> ${ls.l_online}`

    setTimeout(() => {
        document.getElementById('user').innerHTML = `${l_online}`
    }, 3000);
})
const listBind = async (favoriteStr) =>{
    console.log(favoriteStr)
    if(favorite.length > 0){
        const apiUrl = 'https://financialmodelingprep.com/api/v3/quote/' + favorite + '?apikey=v6wkuiy79ivhrkxaROaKTW3hCItUnZUA';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            let htmlstring="";
            data.forEach((element) =>{
                htmlstring +=
                    '    <tr>' +
                    '    <th scope=\'row\'>'+element.symbol+'</th>' +
                    '    <th scope=\'row\'>'+element.name+'</th>' +
                    '    <th scope=\'row\'>'+element.price+'</th>' +
                    '    <th scope=\'row\'>'+element.avgVolume+'</th>' +
                    '    <th scope=\'row\'>'+element.dayHigh+'</th>' +
                    '    <th scope=\'row\'>'+element.dayLow+'</th>' +
                    '    <th scope=\'row\'> closed</th></tr>'
            });
            stocks.innerHTML = '<table><tr><th scope="col">Symbol</th><th scope="col">Company Name</th><th scope="col">Current Price</th><th scope="col">AVG</th><th scope="col">High</th><th scope="col">Low</th><th scope="col">status</th></tr>' +htmlstring +'</table>'
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

send_Symbol.addEventListener('click',()=>{
    if(symbol_input.value.length >= 1 && !favorite.includes(symbol_input.value,0)){
        console.log(favorite.length)
        if(favorite.length > 0){
            favorite += ',' + symbol_input.value
        }else{
            favorite = symbol_input.value
        }
        symbol_input.value = ''
        listBind(favorite)
    }
})
setInterval(() => {
    // 传递你的 favoriteStr 参数，例如 "AAPL,GOOGL,MSFT"
    listBind(favorite);
    //console.log('haha')
}, 5000);
//setInterval("listBind()","5000");
