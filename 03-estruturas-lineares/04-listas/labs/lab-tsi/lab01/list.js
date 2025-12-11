items = [10, 20, 30]; //40

function append(element) {
  // inserir no fim
  //items.push(element);
  items[items.length] = element;
}

function insert(pos, element) {
  if (posIsValid(pos)) {
    //items.splice(pos, 0, element);
    for (let i = items.length; i > pos; i--) {
      items[i] = items[i - 1];
    }
    items[pos] = element;
    return true;
  }
  return false;
}

function remove(element) {
  const pos = indexOf(element);
  return removeAt(pos);
}

function removeAt(index) {
  if (posIsValid(index)) {
    //items.splice(index, 1);
    for (let i = index; i < items.length - 1; i++) {
      items[i] = items[i + 1];
    }
    items.length--;
    return true;
  }
  return false;
}

function indexOf(element) {
  //return items.indexOf(element);
  for (let i = 0; i < items.length; i++) {
    if (element === items[i]) {
      return i;
    }
  }
  return -1;
}
function posIsValid(index) {
  return index >= 0 && index < items.length;
}

function size() {
  return items.length;
}

function clear() {
  items = [];
}
