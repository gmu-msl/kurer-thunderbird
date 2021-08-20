
// This content script injects a notification bar which can be interfaced via runtime messages of type "notif"

/** Communication port with background script */
var port = browser.runtime.connect()
var notifBar: HTMLDivElement = null

log("loaded Message Display Content Script!")

function initNotifBar(text: string[]) {
    notifBar = document.createElement("div");
    notifBar.classList.add("nBarOuter","nBarAnimIn")
    const notifLogo = document.createElement("div");
    notifLogo.classList.add("nBarLogo")
    notifBar.appendChild(notifLogo)
    text.forEach(t=>{
        let notifText = document.createElement("div");
        notifText.classList.add("nBarStatus")
        notifText.innerHTML = t
        notifBar.appendChild(notifText)
    })
    document.body.insertBefore(notifBar, document.body.firstChild);
}
/** Shows the passed notification html in the notification bar */
function showNotif(notif:string[]) {
    // if (notifBar) {
    //     notifBar.remove()
    //     notifBar = null; notifText = null
    // }


    if (!notifBar) initNotifBar(notif)
    else {
        Array.from(notifBar.getElementsByClassName("nBarStatus"))
        .forEach(t=>t.remove())
        notif.forEach(t=>{
            let notifText = document.createElement("div");
            notifText.classList.add("nBarStatus")
            notifText.innerHTML = t
            notifBar.appendChild(notifText)
        })
        notifBar.classList.remove("nBarAnimIn")
        notifBar.classList.remove("nBarAnimColorin")
        void notifBar.offsetWidth
        notifBar.classList.add("nBarAnimColorin")
        
    }
}

browser.runtime.onMessage.addListener((msg:Message)=>{
    if (!msg.type || msg.type != "notif") return
    let notif = msg.payload
    if (msg.color) notif.forEach((v,i,a)=>{
        a[i] = `<span class="color-${msg.color}">${v}</span>`
    })
    showNotif(notif)
})

/** Transmit console log to background script */
function log(obj:any, dir?: boolean) {
    let message: Message = {type: dir?"dir":"log", payload: obj}
    port.postMessage(message)
}