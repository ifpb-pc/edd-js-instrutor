class Node {
    constructor(value, prev = null) {
        this.value = value
        this.prev = prev
    }
    toString(){
        return `Node [ ${this.value} ]`
    }
}

class Stack {
    constructor(){
        this.top = null
        this._size = 0
    }
    push(value){
        const node = new Node(value, null)
        if (this.isEmpty()){
          // pilha  vazia
          this.top = node
        } else {
          // pilha  preenchida
          node.prev = this.top
          this.top = node
        }
        this._size++
    }
    pop(){
        let value = null
        if (!this.isEmpty()) {
            value = this.top.value
            this.top = this.top.prev
            this._size--
        }
        return value
    }
    peek(){
        return this.isEmpty()? null: this.top.value
    }
    size(){
        return this._size
    }
    isEmpty(){
        return this.size() === 0
    }
}

export {Stack}