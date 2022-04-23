import React, { useState, useEffect } from "react";

function Proposals({ stateStatus, state, stateVoter }) {

    const [stateProposals, setStateProposals] = useState({proposals: null});
    
    useEffect(() => {
        (async function () {
          try {
            let options = {
                fromBlock: 0, 
                toBlock: 'latest'
              };
            const listProposals = await state.contract.getPastEvents('ProposalRegistered', options);
            setStateProposals({proposals: listProposals});
            } catch (error) {
                return <div>Error when trying to catch the proposals</div>
                console.error(error);
                }
        })();
      }, [])

      const addProposal = async (e) => {
        e.preventDefault();
        const { accounts, contract } = state;
        let proposal = document.getElementById("proposal").value;
        await contract.methods.addProposal(proposal).send({ from: accounts[0] });
        let options = {
          fromBlock: 0, 
          toBlock: 'latest'
        };
        let tempListProposals = await contract.getPastEvents('ProposalRegistered', options);
        setStateProposals({proposals: tempListProposals});
      }

      const setVote = async (param1) => {
        const { accounts, contract } = state;
        await contract.methods.setVote(param1).send({ from: accounts[0] });
        window.location.reload();
      }

        if (stateProposals.proposals == null) {
            return (
                <div className='proposals'>
                    <div className='title-proposals'>
                        <h2>PROPOSALS</h2>
                    </div>
                    <div className='add-proposal'>
                        <input type="text" id="proposal" placeholder="proposal" />
                        <button onClick={addProposal}>ADD PROPOSAL</button>
                    </div>
                    <p>No proposals available</p>
                </div>
            )
        } else if (stateStatus.flowstatus == "ProposalsRegistrationStarted") {
            return (
                <div className='proposals'>
                    <div className='title-proposals'>
                        <h2>PROPOSALS</h2>
                    </div>
                    <div className='add-proposal mb-4'>
                        <input type="text" id="proposal" placeholder="write here" />
                        <button onClick={addProposal}>Add Proposal</button>
                    </div>
                    <ul className='get-proposals list-group'>
                    {stateProposals.proposals.map((proposal) => (
                        <li className='list-group-item w-50 mx-auto my-1 bg-light h4'>{proposal.returnValues.description}</li>
                    ))}
                </ul> 
                </div>
            )
        
        } else if (stateStatus.flowstatus == "ProposalsRegistrationEnded") {
            return (
                <div className='proposals'>
                    <div className='title-proposals'>
                        <h2>PROPOSALS</h2>
                    </div>
                    <ul className='get-proposals list-group'>
                    {stateProposals.proposals.map((proposal) => (
                        <li className='list-group-item w-50 mx-auto my-1 bg-light h4'>{proposal.returnValues.description}</li>
                    ))}
                </ul> 
                </div>
            ) 
        } else if (stateStatus.flowstatus == "VotingSessionStarted") {
            if (stateVoter.hasVoted == false) {
                return (
                    <div className='proposals'>
                        <div className='title-proposals'>
                            <h2>PROPOSALS</h2>
                        </div>
                        <ul className='get-proposals list-group'>
                            {stateProposals.proposals.map((proposal) => (
                                <li className='list-group-item w-50 mx-auto my-1 bg-light h4'>
                                    {proposal.returnValues.description}
                                    <button className='mx-5 bg-success' onClick={e => { e.preventDefault(); setVote(proposal.returnValues.proposalId)}}>Vote</button> 
                                </li>
                            ))}
                        </ul> 
                    </div>
                    )
            } else {
                return (
                    <div className='proposals'>
                        <div className='title-proposals'>
                            <h2>PROPOSALS</h2>
                        </div>
                        <ul className='get-proposals list-group'>
                            {stateProposals.proposals.map((proposal) => (
                            <li className='list-group-item w-50 mx-auto my-1 bg-light h4'>{proposal.returnValues.description}</li>
                    ))}
                        </ul> 
                    </div>
                    )
            }
        } else if (stateStatus.flowstatus == "VotingSessionEnded") {
            return (
                <div className='proposals'>
                    <div className='title-proposals'>
                        <h2>PROPOSALS</h2>
                    </div>
                    <ul className='get-proposals list-group'>
                            {stateProposals.proposals.map((proposal) => (
                            <li className='list-group-item w-50 mx-auto my-1 bg-light h4'>{proposal.returnValues.description}</li>
                    ))}
                    </ul> 
                </div>
                )

        } else { return <div></div>}
    }

export default Proposals;