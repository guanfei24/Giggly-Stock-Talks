const socket = io()
const user_name = document.getElementById('name')
//const login_button = document.getElementById('login_button')


const login = ()=>{
    if(user_name.value.length >= 1){
        console.log('login~~~~~~~')
        socket.on('name_list', (name_list) => {
            //console.log(1111)
            //console.log(name_list)
        })
    }
}
//login_button.addEventListener('click',(e)=>{
    //e.preventDefault()
    //console.log(2)
    //login()
//})
