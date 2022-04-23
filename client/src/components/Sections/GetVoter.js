import React, { useState } from "react";
import Web3 from "web3";

function GetVoter({state}) {
    const [stateGetVoter, setStateGetVoter] = useState({registered: false, hasVoted: false, proposalId: 0, display: false});

      const getVoter = async (e) => {
        e.preventDefault();
        const { accounts, contract } = state;
        let address = document.getElementById("getvoter").value;
        if (Web3.utils.isAddress(address) == true) {
          const voter = await state.contract.methods.getVoter(address).call({ from: accounts[0] });
          let registered = voter.isRegistered == true;
          let hasVoted = voter.hasVoted == true;
          let proposalId = voter.votedProposalId;
          setStateGetVoter({registered: registered, hasVoted: hasVoted, proposalId: proposalId, display: true});
          console.log(voter);
        } else {
          alert("Please enter a valid address")
        };
      }

    if (stateGetVoter.display == true) {

       return (
          <div>
                <input type="text" id="getvoter" placeholder="address" />
                <button onClick={getVoter}>Search</button>
                <p>Addres registered : {stateGetVoter.registered.toString()}</p>  
                <p>has Voted : {stateGetVoter.hasVoted.toString()}</p>
                <p>Voted for : {stateGetVoter.proposalId}</p>
            </div>
            )
       } else { 
           return (
            <div>
                <input type="text" id="getvoter" placeholder="address" />
                <button onClick={getVoter}>Search</button>
            </div>
           )}
 }

export default GetVoter;