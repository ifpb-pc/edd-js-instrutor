const stack = []

// adiciona no topo
function push(value) {
  stack.push(value)
}

// remove do topo
function pop() {
  return stack.pop()
}

// retorna o valor que esta no topo
function peek() {
  return stack[size() - 1]
}

// retorna se esta vazia
function isEmpty() {
  return size() === 0
}

// retorna o tamanho
function size() {
  return stack.length
}
module.exports = { push, pop, peek, isEmpty, size, stack }
