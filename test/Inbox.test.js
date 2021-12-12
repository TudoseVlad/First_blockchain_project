const assert  = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //contructor
const web3 = new Web3(ganache.provider());

const {abi, evm} = require('../compile');

let accounts;
let inbox;
const INITIAL_MESSAGE='Hi there!';

 beforeEach(async () =>{
    //Get a list of all accounts
    accounts = await web3.eth.getAccounts();
        
    
    //Use one of those accounts to deploy
    //the contract
    inbox = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object,
            arguments: [INITIAL_MESSAGE] })
        .send({ from: accounts[0], gas: '1000000' })
 });

 describe('Inbox',() =>{
     it('deploys a contract', () =>{
            assert.ok(inbox.options.address);
     });

     it('message contrutor', async () =>{
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE);
    }); 

    it('Set message',async () =>{
        const newMessage= 'bye';
        await inbox.methods.setMessage(newMessage).send({ from: accounts[0] }); // acccount[0] pays for the change
        const message = await inbox.methods.message().call();
        assert.equal(message, newMessage);
    });
 });
