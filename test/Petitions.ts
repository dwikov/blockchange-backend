import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Petitions", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployInitFixture() {
    // Contracts are deployed using the first signer/account by default
    const [user, anotherUser] = await ethers.getSigners();

    const Petitions = await ethers.getContractFactory("Petitions");
    const petitions = await Petitions.deploy();

    const title = "Some title for the petition"
    const contentCID = "QmeWg7fhRMVNpNZ5KWo9KLmMC3CrXH6QjwQjU7CbSSHNye"
    const imageCID = "QmeWg7fhRMVNpNZ5KWo9KLmMC3CrXH6QjwQjU7CbSSHNye"

    return { petitions, user, anotherUser, title, contentCID, imageCID };
  }

  describe('addPetition', () => { 
    it("adds petition to the array of petitions", async () => {
      const { petitions, title, contentCID, imageCID } = await loadFixture(deployInitFixture);

      await petitions.addPetition(title, contentCID, imageCID);

      expect((await petitions.petitions(0))[0]).to.equal(0);
      expect((await petitions.petitions(0))[1]).to.equal(0);
    });

    it("emits an event when an petition is added", async () => {
      const { petitions, title, contentCID, imageCID } = await loadFixture(deployInitFixture);

      expect(petitions.addPetition(title, contentCID, imageCID)).to.emit(petitions, "PetitionCreated");
    });
  });

  describe('vote', () => { 
    it("votes a petition", async () => {
      const { petitions, anotherUser, title, contentCID, imageCID } = await loadFixture(deployInitFixture);
      
      await petitions.addPetition(title, contentCID, imageCID);
      await petitions.vote(0);
      await petitions.connect(anotherUser).vote(0);

      expect((await petitions.petitions(0))[1]).to.equal(2);      
    });

    it("reverts with the right error if the user already voted for the petition", async () => {
      const { petitions, title, contentCID, imageCID } = await loadFixture(deployInitFixture);

      await petitions.addPetition(title, contentCID, imageCID);
      await petitions.vote(0);

      expect(petitions.vote(0)).to.be.revertedWith(
        "User already voted this petition"
      );
    });

    it("reverts with the right error if the id does not exist", async () => {
      const { petitions } = await loadFixture(deployInitFixture);

      expect(petitions.vote(4)).to.be.revertedWith(
        "Id does not exist"
      );
    });

    it("emits an event when an petition is voted", async () => {
      const { petitions, title, contentCID, imageCID } = await loadFixture(deployInitFixture);

      await petitions.addPetition(title, contentCID, imageCID);
      expect(petitions.vote(0)).to.emit(petitions, "PetitionVoted");
    });
  });

  describe('flipFollow', () => { 
    it("reverts with the right error if the id does not exist", async () => {
      const { petitions } = await loadFixture(deployInitFixture);

      expect(petitions.flipFollow(4)).to.be.revertedWith(
        "Id does not exist"
      );
    });

    it("emits the right event when petition is followed", async () => {
      const { petitions, title, contentCID, imageCID } = await loadFixture(deployInitFixture);

      await petitions.addPetition(title, contentCID, imageCID);
      expect(petitions.flipFollow(0)).to.emit(petitions, "PetitionFollowed");
    });

    it("emits the right event when petition is unfollowed", async () => {
      const { petitions, title, contentCID, imageCID } = await loadFixture(deployInitFixture);

      await petitions.addPetition(title, contentCID, imageCID);
      await petitions.flipFollow(0);
      expect(petitions.flipFollow(1)).to.emit(petitions, "PetitionUnfollowed");
    });
  });
});
