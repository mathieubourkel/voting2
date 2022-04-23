import React from 'react';
import GetVoter from './Sections/GetVoter';
import { Button } from 'react-bootstrap';

function Navbar({state, stateVoter, stateStatus, setStatus}) {

      if (state.owned == true) {
            if (stateStatus.flowstatus == "VotesTallied") {
                  return (
                        <div className='navbar mx-3 mb-5'>
                        <div className='search'>
                              <GetVoter stateVoter={stateVoter} state={state} />
                        </div>
                        <div className='display-status'>
                              <h4>Status: {stateStatus.flowstatus}</h4>
                        </div>
                  </div>
                  )
            } else {
                  return (
                        <div className='navbar mx-3 mb-5'>
                              <div className='search'>
                                    <GetVoter stateVoter={stateVoter} state={state} />
                              </div>
                              <div className='display-status'>
                                    <h4>Status: {stateStatus.flowstatus}</h4>
                              </div>
                              <div className='btn-next-status'>
                                    <button className='btn btn-success' onClick={setStatus}>{stateStatus.nextstatus}</button> 
                              </div>
                        </div> 
                        )};
      } else {
            return <div className='navbar mx-3 mb-5'>
            <div className='search'>
                  <GetVoter stateVoter={stateVoter} state={state} />
            </div>
            <div className='display-status'>
                  <h4>Status: {stateStatus.flowstatus}</h4>
            </div>
      </div>
      }
 }

export default Navbar;