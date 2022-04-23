import React from "react";

function Header({state}) {

          return (

                  <div className='addr text-right'>
                        Connected Wallet : {state.accounts[0]}
                  </div>      

          );  
}

export default Header;