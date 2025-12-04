const Stack = require("./stack-linked")

describe("Teste nos métodos de Stack", () => {
    let stack;

    beforeEach(() => {
        stack = new Stack()
    });


    test('deve iniciar vazia', () => {
        expect(stack.isEmpty()).toBe(true);
        expect(stack.size()).toBe(0);
        expect(stack.peek() == null || stack.peek() == undefined).toBe(true);
    });

    test('push deve adicionar elementos ao topo', () => {
        stack.push(10);
        stack.push(20);

        expect(stack.size()).toBe(2);
        expect(stack.peek()).toBe(20);
        expect(stack.isEmpty()).toBe(false);
    });

    test('pop deve remover e retornar o elemento do topo', () => {
        stack.push('a');
        stack.push('b');

        expect(stack.pop()).toBe('b');
        expect(stack.size()).toBe(1);
        expect(stack.peek()).toBe('a');
    });

    test('pop em pilha vazia deve retornar null ', () => {
        expect(stack.pop()).toBeNull(); 
    });

    test('peek deve retornar o topo sem remover', () => {
        stack.push(100);
        stack.push(200);

        expect(stack.peek()).toBe(200);
        expect(stack.size()).toBe(2);
    });

    test('size deve retornar o número correto de elementos', () => {
        expect(stack.size()).toBe(0);
        stack.push(1);
        stack.push(2);
        expect(stack.size()).toBe(2);
        stack.pop();
        expect(stack.size()).toBe(1);
    });

    test('isEmpty deve indicar corretamente se está vazia', () => {
        expect(stack.isEmpty()).toBe(true);
        stack.push('x');
        expect(stack.isEmpty()).toBe(false);
        stack.pop();
        expect(stack.isEmpty()).toBe(true);
    });
})
