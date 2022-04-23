import React, { useState, useEffect } from "react";

function Winner({state}) {
        const [stateWinner, setStateWinner] = useState({winnerId: 0, name: null, count:0});
        useEffect(() => {
            (async function () {
              try {
                const winnerId = await state.contract.methods.winningProposalID().call({ from: state.accounts[0] });
                const winner = await state.contract.methods.getOneProposal(winnerId).call({ from: state.accounts[0] });
                const name = winner.description;
                const count = winner.voteCount;
                setStateWinner({winnerId: winnerId, name: name, count: count});
                } catch (error) {
                    return <div>Error when trying to catch the proposals</div>
                    console.error(error);
                    }
            })();
          }, [])
          console.log(stateWinner.winner);
        return (
            <div className='resultat'>
                <h2 className='mb-5'>THE WINNER IS</h2>
                <h3 className='bg-primary w-50 mx-auto'>Winner ID : {stateWinner.winnerId}</h3>
                <h3 className='w-50 mx-auto'>Name : {stateWinner.name}</h3>
                <h3 className='bg-danger w-50 mx-auto'>Count : {stateWinner.count}</h3>
            </div>
            )
 }

export default Winner;