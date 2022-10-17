// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Petitions {
  struct Petition{
    uint _id;
    uint votersCount;
    uint timeCreated;
    string title;
    string contentCID;
    string imageCID;
  }

  event PetitionCreated(Petition _petition);
  event UserVoted(Petition _petition);
  event PetitionFollowed(Petition _petition);
  event PetitionUnfollowed(Petition _petition);

  mapping(uint => mapping(address => bool)) public voted;
  mapping(address => mapping(uint => bool)) public following;
  Petition[] public petitions;
  uint public petitionsCount;

  function addPetition(string calldata _title, string calldata contentCID, string calldata imageCID) external {
    petitions.push(Petition(petitions.length, 0, block.timestamp, _title, contentCID, imageCID));
    petitionsCount++;
    emit PetitionCreated(petitions[petitions.length - 1]);
  }

  function vote(uint _petitionId) external {
    require(_petitionId < petitions.length, "Id does not exist");
    require(!voted[_petitionId][msg.sender], "User already voted this petition");

    petitions[_petitionId].votersCount++;
    voted[_petitionId][msg.sender] = true;

    emit UserVoted(petitions[_petitionId]);
  }

  function flipFollow(uint _petitionId) external {
    require(_petitionId < petitions.length, "Id does not exist");

    if(following[msg.sender][_petitionId]){
      following[msg.sender][_petitionId] = false;
      
      emit PetitionUnfollowed(petitions[_petitionId]);
    }
    else{
      following[msg.sender][_petitionId] = true;

      emit PetitionFollowed(petitions[_petitionId]);
    }
  }
}
