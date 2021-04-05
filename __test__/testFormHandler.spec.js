// Import the js file to test
import { handleSubmit } from "../src/client/js/formHandler"

describe ('Does it exist?', ()=> {
    test('Do we get a response', () =>{
        expect(handleSubmit).toBeDefined();
})});


describe ('Is there a function', ()=> {
    test('We expect to see a function', () =>{
        expect(typeof handleSubmit).toBe('function');
})});

