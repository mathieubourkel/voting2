import Footer from "./components/Footer.js";
import Navbar from "./components/Navbar.js";
import Header from "./components/Header.js";
import Main from "./components/Main.js";
import "./App.css";
import React, { useEffect, useState } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import Web3 from "web3";

function App() {
  const [state, setState] = useState({ owned: false, web3: null, accounts: null, contract: null});
  const [stateStatus, setStateStatus] = useState({flowstatus: null, nextstatus: null});
  const [stateVoter, setStateVoter] = useState({voter: null, registered: false, hasVoted: false});
  
  useEffect(() => {
      (async function () {
        try {
          const web3 = await getWeb3();
          const accounts = await web3.eth.getAccounts();
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = VotingContract.networks[networkId];
          const instance = new web3.eth.Contract(
              VotingContract.abi,
              deployedNetwork && deployedNetwork.address,
            );
          const status = await instance.methods.workflowStatus().call();
          const owner = await instance.methods.owner().call();
          const register = await instance.methods.getVoter(accounts[0]).call({ from: accounts[0] });
          let flowstatus, nextstatus;

          if (status == 0){
              flowstatus = "RegisteringVoters";
              nextstatus = "ProposalsRegistrationStarted";
          } else if (status == 1){
              flowstatus = "ProposalsRegistrationStarted";
              nextstatus = "ProposalsRegistrationEnded";
          } else if(status == 2) {
              flowstatus = "ProposalsRegistrationEnded";
              nextstatus = "VotingSessionStarted";
          } else if(status == 3) {
              flowstatus = "VotingSessionStarted";
              nextstatus = "VotingSessionEnded";
          } else if(status == 4) {
              flowstatus = "VotingSessionEnded";
              nextstatus = "VotesTallied";
          } else if(status == 5) {
              flowstatus = "VotesTallied";
          };
          
          let owned = accounts[0] == owner;
          let registered = register.isRegistered == true;
          let hasVoted = register.hasVoted == true;

          setState({ owned: owned, web3: web3, accounts: accounts, contract: instance,  });
          setStateStatus({ flowstatus: flowstatus, nextstatus: nextstatus}); 
          setStateVoter({registered: registered, hasVoted: hasVoted})
          
          } catch (error) {
            console.error(error);
          }})();}, [])
        
const setStatus = async (e) => {
  e.preventDefault();
  const { accounts, contract } = state;
  let status = await contract.methods.workflowStatus().call();
  let flowstatus;
  let nextstatus;
  if (status == 0){
    await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
      flowstatus = "ProposalsRegistrationStarted";
      nextstatus = "ProposalsRegistrationEnded";
  } else if(status == 1) {
    await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
      flowstatus = "ProposalsRegistrationEnded";
      nextstatus = "VotingSessionStarted";
  } else if(status == 2) {
    await contract.methods.startVotingSession().send({ from: accounts[0] });
      flowstatus = "VotingSessionStarted";
      nextstatus = "VotingSessionEnded";
  } else if(status == 3) {
    await contract.methods.endVotingSession().send({ from: accounts[0] });
      flowstatus = "VotingSessionEnded";
      nextstatus = "VotesTallied";
  } else if(status == 4) {
    await contract.methods.tallyVotes().send({ from: accounts[0] }); 
      flowstatus = "VotesTallied";
  };
  setStateStatus({flowstatus: flowstatus, nextstatus: nextstatus});
};

const addVoter = async (e) => {
  e.preventDefault();
  const { accounts, contract } = state;
  let address = document.getElementById("address").value;
  if (Web3.utils.isAddress(address) == true) {
      await contract.methods.addVoter(address).send({ from: accounts[0] });
  } else {
      alert("Please enter a valid address")
  };
}

if (stateVoter.registered == true)  {
  return(
    <div className="App">
      <header className='App-header'>
        <Header state={state}/>
      </header>
      <body className="Main d-flex flex-column min-vh-100 mt-3">
        <h4 className='w-50 p-2 mx-auto border border-primary'>VOTING DAPP (look vintage)</h4>
        <Navbar state={state} stateVoter={stateVoter} stateStatus={stateStatus} setStatus={setStatus}/>
        <Main state={state} stateStatus={stateStatus} addVoter={addVoter} stateVoter={stateVoter}/>
      </body>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  )
} else if (state.accounts == null) {
  return <div className="Main d-flex flex-column mt-3 mx-auto w-50 bg-danger" >
        <h1 className='mx-auto'>Wallet not found</h1>
        <h3 className='mx-auto'>You have to connect your wallet, if you have one..</h3>
    </div>
} else {
  return <div className="Main d-flex flex-column mt-3 mx-auto w-50 bg-danger" >
    <h3 className='mx-auto'>You are not registered as a voter.</h3> 
    <h3 className='mx-auto'>Maybe you can try to kindly ask the admin to be register</h3>
    </div>;
}
}
export default App;