import React from "react";
import Proposals from "./Sections/Proposals.js";
import Winner from "./Sections/Winner.js";

function Main({state, stateStatus, addVoter, stateVoter}) {

    if (stateStatus.flowstatus == "RegisteringVoters"){
        if (state.owned == true) {
            return (

                <div className='main'>
                    <h3 className='mb-5'>Hello Administrator, you can now registering the voters!</h3>
                    <div className='add-voter'>
                        <input type="text" id="address" placeholder="address" />
                        <button onClick={addVoter}>ADD VOTER</button>
                    </div>
                </div>
            )

        } else {
            return (

                <div className='main'>
                    The owner is actually registering the voters, please be patient you will be able to access to the vote soon
                </div>
            )
        };

    } else if (stateStatus.flowstatus == "ProposalsRegistrationStarted" || 
    stateStatus.flowstatus == "ProposalsRegistrationEnded" || stateStatus.flowstatus == "VotingSessionStarted" || stateStatus.flowstatus == "VotingSessionEnded"){

        return (

            <Proposals state={state} stateStatus={stateStatus} stateVoter={stateVoter}/>
        
    )} else if (stateStatus.flowstatus == "VotesTallied") {

        return(
            <div>
                <Winner state={state}/>
                <Proposals state={state} stateStatus={stateStatus} stateVoter={stateVoter}/>
            </div>
        )

    } else { 

        return <div> Its not the time to access to the voting App</div>
    }
}

export default Main;