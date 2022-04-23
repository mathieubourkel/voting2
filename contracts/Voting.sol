// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;
import "@openzeppelin/contracts/access/Ownable.sol";

/**
* @title A Voting contract on the eth blockchain
* @author Mathieu Bourkel
* @notice You can use this contract only one time
 */
contract Voting is Ownable {

    /// @dev variable to get the winner ID
    uint public winningProposalID;
    
    /// @dev Struct to set Registering, hasVoted and votedProposalId of every voters
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    /// @dev struct to set the description and the voteCount of every proposals
    struct Proposal {
        string description;
        uint voteCount;
    }

    /// @dev this list of enum are used to manage the status of the voting app
    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    WorkflowStatus public workflowStatus;

    /// @dev array to stock all of the proposal
    Proposal[] proposalsArray;
    
    /// @dev mapping to link every adress to a struct Voter with all the infos
    mapping (address => Voter) voters;

    /// @dev We create some events at many steps of the voting
    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId, string description);
    event Voted (address voter, uint proposalId);

    /// @dev modifier use to restrict the access to the voters only
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    /// @dev I use a constructor to make automatically the owner a voter
    constructor() {
        voters[owner()].isRegistered = true;
    }


    /**
    * @notice Use this function to get the informations of a voter
    * @dev Not working if the address is not an eth valid address
    * @param _addr The address of the voter you want the informations
    * @return Voter Return the struct link to the address via the mapping "voters"
     */
    function getVoter(address _addr) external view returns (Voter memory) {
        return voters[_addr];
    }

    /**
    * @notice Use this function to get the informations of one proposal
    * @dev Not working if you put an inexistent ID on param
    * @param _id The ID of the proposal you want to get the information
    * @return Proposal Return the proposal struct
     */
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

    /**
    * @notice Use this function to get all the proposals
    * @dev Facultatif
    * @return LISTE An array of every proposals made
     */
    function getAllProposals() external view onlyVoters returns(Proposal[] memory LISTE){
        return proposalsArray;
    }

 
    // ::::::::::::: REGISTRATION ::::::::::::: // 
    /** 
    * @notice Use this function to add a voter the list of voters
    * @dev Not working if you put an invalid eth address, only available during registeringVoters
    * @param _addr The address you want to add to the voters
     */
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 
    // ::::::::::::: PROPOSAL ::::::::::::: // 
    /** 
    * @notice Use this function to add a proposal to the array of proposals
    * @dev 50 max to prevent DDOS, you cant add nothing, only available during RegistrationStarted
    * @param _desc The name you want to give to the proposal
     */
    function addProposal(string memory _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(proposalsArray.length < 50, "Too many proposals for this election");
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1, _desc);
    }

    // ::::::::::::: VOTE ::::::::::::: //
    /** 
    * @notice Use this function to give a vote to a proposal
    * @dev need to use an available Id, only during VotingSessionStarted, the voter need to have the right
    * @param _id ID of the proposal you want to add a vote
     */
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id <= proposalsArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;
        emit Voted(msg.sender, _id);
    }

    /** 
    * @notice Use this function to change the status to ProposalsRegistrationStarted
    * @dev need to be at the status registeringVoters
     */
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }
    /** 
    * @notice Use this function to change the status to ProposalsRegistrationEnded
    * @dev need to be at the status ProposalsRegistrationStarted
     */
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }
    /** 
    * @notice Use this function to change the status to VotingSessionStarted
    * @dev need to be at the status ProposalsRegistrationEnded
     */
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }
    /** 
    * @notice Use this function to change the status to VotingSessionEnded
    * @dev need to be at the status VotingSessionStarted
     */
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /** 
    * @notice Use this function to change the status to VotesTallied, and count thes votes to get the winner
    * @dev need to be at the status VotingSessionEnded, we use a temporary variable to coast less gas
     */
   function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
       uint _winningProposalId;
      for (uint256 p = 0; p < proposalsArray.length; p++) {
           if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
               _winningProposalId = p;
          }
       }
       winningProposalID = _winningProposalId;
       
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}