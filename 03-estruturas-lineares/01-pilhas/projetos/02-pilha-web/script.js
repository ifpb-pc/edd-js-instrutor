import {Stack} from "./stack-linked.js"

const s = new Stack()

meuForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    const data = new FormData(e.target)
    console.log([...data.entries()])
    const valor = document.querySelector("#elemento").value
    s.push(valor)
    renderizar()
})
popButton.addEventListener("click", ()=>{
    const value = s.pop()
    logValue(value)
    renderizar()
})
peekButton.addEventListener("click", ()=>{
    const value = s.peek()
    logValue(`Top: ${value}`)
    renderizar()
})
isEmptyButton.addEventListener("click", ()=>{
    const value = s.isEmpty()
    logValue(`Is Empty?  ${value}`)
    renderizar()
})
sizeButton.addEventListener("click", ()=>{
    const value = s.size()
    logValue(`Size: ${value}`)
    renderizar()
})

function logValue(value){
    logger.innerHTML = `<p>${value}</p>`
    setTimeout(()=>{
        logger.innerHTML = ""
    }, 2500)
}

function renderizar(){
    const divStack = document.querySelector("#stack")
    divStack.innerHTML = ""
    
    let clone = new Stack()
    clone.top = s.top
    clone._size = s._size

    let temp = clone.top 
    while (temp!==null) {
        const newDiv = document.createElement("div")
        newDiv.className = "border rounded  py-2 px-3 text-gray-700"
        newDiv.innerHTML = temp.value
        divStack.appendChild(newDiv)
        temp=temp.prev
    }
}