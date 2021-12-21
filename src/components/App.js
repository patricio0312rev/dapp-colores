import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Color from '../abis/Color.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('¡Considera usar Metamask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    // Cargar una cuenta
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    
    const networkId = '5777' // await web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if(networkData) {
      const abi = Color.abi;
      const address = networkData.address;
      const contract= new web3.eth.Contract(abi, address);

      this.setState({contract});

      // Funcion totalSupply del Smart Contract
      const totalSupply = contract.methods.totalSupply().call(); // Coger información de la blockchain = call | Enviar informacion a la blockchain = send
      this.setState({totalSupply});

      // Carga de colores
      for(var i=1; i <= totalSupply; i++){
        const color = await contract.methods.colors(i-1).call();
        this.setState({colors: [...this.state.colors, color]});
      }
    } else {
      window.alert('¡Smart contract no desplegado en la red!');
    }
  }

  // Constructor
  constructor(props) {
    super(props);
    
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: [],
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://frogames.es/rutas-de-aprendizaje"
            target="_blank"
            rel="noopener noreferrer"
          >
            DApp de Patricio
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="https://frogames.es/rutas-de-aprendizaje"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>DApp de Patricio</h1>
                <p>
                  Edita <code>src/components/App.js</code> y guarda para recargar.
                </p>
                <a
                  className="App-link"
                  href="https://frogames.es/rutas-de-aprendizaje"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                   APRENDE BLOCKCHAIN <u><b>AHORA! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
