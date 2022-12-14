import logo from './logo.png';
import './App.css';
import web3 from './web3';
import myContract from './myContract';
import React from "react";

class App extends React.Component {
  state = {
    owner: '',
    name: '',
    getMyChips: '',
    calculateChipSell:'',
    getBalance: '',
    chipRewards: '',
    stakeValue: 0,
    stakeIndex: 0,
    withdrawValue: 0,
    account: '',
    balance: '...',
    stakedBalance: '...',
    tableContent: [],
    isWin: false,
    showModal: false
  };


/*  
  static async getInitialProps(props) {
    const child = await web3.utils.fromWei(firstDepositAmount, 'ether');
    return {
          address: props.query.address
        };
  }
*/






  showData() {

/*    myContract.methods.balance().call().then(wei => {
      this.setState({ balance: wei / (10 ** 18) });
    });
*/

/*   myContract.methods.hasStake(this.state.account).call().then(stakedData => {
      this.setState({ stakedBalance: stakedData[0] / (10 ** 18) });
      this.setState({ tableContent: stakedData[1] });
      console.log(stakedData[1][0])
    });
*/

    myContract.methods.getBalance().call().then(wei => {
      this.setState({ getBalance: wei / (10 ** 18)});
    });


    myContract.methods.getMyChips(this.state.account).call().then(wei => {
      this.setState({ getMyChips: wei });
    });


    myContract.methods.owner().call().then(owner => {
      this.setState({ owner });
    });

    myContract.methods.name().call().then(name => {
      this.setState({ name });
    });

    myContract.methods.chipRewards(this.state.account).call().then(wei => {
      this.setState({ chipRewards: wei / (10 ** 18) });
    });

    myContract.methods.calculateChipSell(this.state.account).call().then(wei => {
      this.setState({ calculateChipSell: wei / (10 ** 18) });
    });
  }

  async componentDidMount() {
    window.ethereum.request({ method: "eth_requestAccounts" }).then(() => {
      web3.eth.requestAccounts()
        .then(accounts => {
          web3.eth.net.getId().then(async netId => {
            if (netId === 269) {
              this.setState({ account: accounts[0] });
              this.showData();
            } else {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x10d' }]
              })
              this.showData();
            }
          })
        })
    });
  }

  onSubmitBalanceOf = async (event) => {
    event.preventDefault();

    // this.setState({ message: 'Waiting on transaction success...' });

    // const accounts = await web3.eth.getAccounts();
    // await myContract.methods.balanceOf(this.state.account).send({
    //   from: accounts[0]
    // });

    // this.setState({ message: '' });
    // Router.replaceRoute(`/hpb/${this.props.address}`);
  };

  handleBuy2 = async () => {
    
    
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const accounts = await web3.eth.getAccounts();

      await myContract.methods.buyChips(this.state.ref, this.state.amount).send({
        from: accounts[0],
        gasPrice: gasPrice
      });



    } catch (error) {
      console.log(error.message);
    }
  }

 


  handleBuy = async(e) => {
    e.preventDefault();

    this.setState({ message: 'Waiting on transaction success...'});

    const accounts = await web3.eth.getAccounts();
 //   const child = Child(this.props.address);
    await myContract.methods.buyChips(this.state.ref).send({
      from: accounts[0], value: web3.utils.toWei(this.state.amount, 'ether')
    });

    this.setState({ message: 'First deposit successful and game name registered!'});
  };

  
 
 
 
 
  handleBuy3 = async (e) => {
    e.preventDefault();
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const accounts = await web3.eth.getAccounts();

      await myContract.methods.buyChips(this.state.ref, this.state.amount).send({
        from: accounts[0],
        gasPrice: gasPrice
      });

      this.showData();

    } catch (error) {
      console.log(error);
    }
  }

  handleFry = async (e) => {
    e.preventDefault();
    this.setState({ message: 'Waiting on transaction success...' });

    try {
      const gasPrice = await web3.eth.getGasPrice();

      await myContract.methods.fryChips(this.state.ref).send({
        from: this.state.account,
        gasPrice: gasPrice
      });

      this.showData();
    } catch (error) {
      console.log(error);
    }
  };

  handleSell = async (e) => {
    e.preventDefault();
    this.setState({ message: 'Waiting on transaction success...' });

    try {
      const gasPrice = await web3.eth.getGasPrice();

      await myContract.methods.sellChips().send({
        from: this.state.account,
        gasPrice: gasPrice
      });

      this.showData();
    } catch (error) {
      console.log(error);
    }
  };




  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    if (!this.state.account) {
      return (
        <div>
        <h1>Please connect your Metamask wallet to HPB first.</h1>
        <img src={logo} className="App-logo" alt="logo" />
        </div>
      )
    }

    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />

        <p className='medium'>Fried Chips Official Contract Address (Verified)
        <br />
        <a rel="noreferrer" target="_blank" href="https://hscan.org/address/0xc3e20fbbd5669e474b439758599f581a693cdfc2">0xC3E20fBbD5669e474b439758599f581A693cdfc2</a></p>
        <p>Up to 8% Daily Return!  |  Up to 2,920% APR!  | Only 2% Dev Fee</p>
        <p className='small'>Earn 5% of the HPB used to Buy or Fry chips from anyone who uses your wallet address as a referral link</p>
        

        <p>HPB in Fried Chips contract: {this.state.getBalance} HPB</p>
        <p>You have {this.state.getMyChips} Chips</p>
       

        <form onSubmit={this.handleBuy} className='mt-20'>
           <div>
            <label className="ml-20">Buy Your Chips (Amount to spend in HPB): </label>
            <input
              type="number"
              min={0}
              value={this.state.amount}
              onChange={event => this.setState({ amount: event.target.value })}
            />
            <br />
            <label className="ml-20">Referral Wallet Address: </label>
            <input
              type="address"
              min={0}
              value={this.state.ref}
              onChange={event => this.setState({ ref: event.target.value })}
            />
            <button className="ml-20">BUY Chips</button>
          </div>
        </form>
        <br />

        <p>Chips available as HPB Rewards {this.state.chipRewards} HPB</p>
        <p className='small'>Fry them (compound your ROI) or Eat them, it's totally up to you!</p>
        <form onSubmit={this.handleFry} className='mt-blue'>
          <label className='mt-blue'>Fry Your Chips: </label><br />
          <div>
            <label className="mt-blue">Referral Wallet Address: </label>
            <input
              type="address"
              min={0}
              value={this.state.ref}
              onChange={event => this.setState({ ref: event.target.value })}
            />
            <button className="ml-20">FRY Chips</button>
          </div>
        </form>
        <br />
          
          <button onClick={this.handleSell} className="call-btn">Eat Chips</button>
        <div>
        
      </div>
        
        
        
        
        

      </div>
    );
  }
}
export default App;
