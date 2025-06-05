import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

describe("LMS_Elemes", function () {
  async function deployLMSElemes() {
    const [oracle, user1, user2, user3] = await hre.viem.getWalletClients();

    const LMS_Elemes = await hre.viem.deployContract("LMS_Elemes", [
      oracle.account.address,
    ]);

    return { LMS_Elemes, oracle, user1, user2, user3 };
  }

  describe("Deployment", function () {
    it("Should set the correct oracle address", async function () {
      const { LMS_Elemes, oracle } = await loadFixture(deployLMSElemes);
      expect(await LMS_Elemes.read.oracle()).to.equal(
        getAddress(oracle.account.address),
      );
    });
  });

  describe("Registration", function () {
    it("Should allow user to request registration", async function () {
      const { LMS_Elemes, user1 } = await loadFixture(deployLMSElemes);
      const lmsid =
        "0x1234567890123456789012345678901234567890123456789012345678901234";

      await expect(
        LMS_Elemes.write.register([lmsid], { account: user1.account }),
      ).to.not.be.rejected;
    });

    it("Should not allow duplicate registration requests from same user", async function () {
      const { LMS_Elemes, user1 } = await loadFixture(deployLMSElemes);
      const lmsid =
        "0x1234567890123456789012345678901234567890123456789012345678901234";

      await LMS_Elemes.write.register([lmsid], { account: user1.account });

      await expect(
        LMS_Elemes.write.register([lmsid], { account: user1.account }),
      ).to.be.rejectedWith("Already requested or registered");
    });

    it("Should return false for unregistered user", async function () {
      const { LMS_Elemes, user1 } = await loadFixture(deployLMSElemes);

      expect(await LMS_Elemes.read.IsRegistered([user1.account.address])).to.be
        .false;
    });
  });

  describe("Oracle Functions", function () {
    it("Should allow oracle to assign LMS ID to requested user", async function () {
      const { LMS_Elemes, oracle, user1 } = await loadFixture(deployLMSElemes);
      const lmsid =
        "0x1234567890123456789012345678901234567890123456789012345678901234";

      // User requests registration
      await LMS_Elemes.write.register([lmsid], { account: user1.account });

      // Oracle assigns LMS ID
      await expect(
        LMS_Elemes.write.assignLMSid([user1.account.address, lmsid], {
          account: oracle.account,
        }),
      ).to.not.be.rejected;

      expect(await LMS_Elemes.read.IsRegistered([user1.account.address])).to.be
        .true;
      expect(await LMS_Elemes.read.getLMSid([user1.account.address])).to.equal(
        lmsid,
      );
    });

    it("Should not allow non-oracle to assign LMS ID", async function () {
      const { LMS_Elemes, user1, user2 } = await loadFixture(deployLMSElemes);
      const lmsid =
        "0x1234567890123456789012345678901234567890123456789012345678901234";

      await LMS_Elemes.write.register([lmsid], { account: user1.account });

      await expect(
        LMS_Elemes.write.assignLMSid([user1.account.address, lmsid], {
          account: user2.account,
        }),
      ).to.be.rejectedWith("Not authorized");
    });

    it("Should not allow oracle to assign LMS ID to user who hasn't requested", async function () {
      const { LMS_Elemes, oracle, user1 } = await loadFixture(deployLMSElemes);
      const lmsid =
        "0x1234567890123456789012345678901234567890123456789012345678901234";

      await expect(
        LMS_Elemes.write.assignLMSid([user1.account.address, lmsid], {
          account: oracle.account,
        }),
      ).to.be.rejectedWith(
        "User has not requested registration or is already registered",
      );
    });

    it("Should not allow oracle to assign same LMS ID twice", async function () {
      const { LMS_Elemes, oracle, user1, user2 } =
        await loadFixture(deployLMSElemes);
      const lmsid =
        "0x1234567890123456789012345678901234567890123456789012345678901234";

      // Both users request registration
      await LMS_Elemes.write.register([lmsid], { account: user1.account });
      await LMS_Elemes.write.register([lmsid], { account: user2.account });

      // Oracle assigns LMS ID to first user
      await LMS_Elemes.write.assignLMSid([user1.account.address, lmsid], {
        account: oracle.account,
      });

      // Should fail when trying to assign same LMS ID to second user
      await expect(
        LMS_Elemes.write.assignLMSid([user2.account.address, lmsid], {
          account: oracle.account,
        }),
      ).to.be.rejectedWith("lmsid already assigned");
    });
  });

  describe("User Status and Data Retrieval", function () {
    it("Should return correct registration status after full registration", async function () {
      const { LMS_Elemes, oracle, user1 } = await loadFixture(deployLMSElemes);
      const lmsid =
        "0x1234567890123456789012345678901234567890123456789012345678901234";

      // Initially not registered
      expect(await LMS_Elemes.read.IsRegistered([user1.account.address])).to.be
        .false;

      // Request registration
      await LMS_Elemes.write.register([lmsid], { account: user1.account });
      expect(await LMS_Elemes.read.IsRegistered([user1.account.address])).to.be
        .false;

      // Complete registration
      await LMS_Elemes.write.assignLMSid([user1.account.address, lmsid], {
        account: oracle.account,
      });
      expect(await LMS_Elemes.read.IsRegistered([user1.account.address])).to.be
        .true;
    });

    it("Should not allow getting LMS ID for unregistered user", async function () {
      const { LMS_Elemes, user1 } = await loadFixture(deployLMSElemes);

      await expect(
        LMS_Elemes.read.getLMSid([user1.account.address]),
      ).to.be.rejectedWith("User not registered");
    });

    it("Should not allow registered user to request registration again", async function () {
      const { LMS_Elemes, oracle, user1 } = await loadFixture(deployLMSElemes);
      const lmsid1 =
        "0x1234567890123456789012345678901234567890123456789012345678901234";
      const lmsid2 =
        "0x5678901234567890123456789012345678901234567890123456789012345678";

      // Complete registration process
      await LMS_Elemes.write.register([lmsid1], { account: user1.account });
      await LMS_Elemes.write.assignLMSid([user1.account.address, lmsid1], {
        account: oracle.account,
      });

      // Should not allow another registration request
      await expect(
        LMS_Elemes.write.register([lmsid2], { account: user1.account }),
      ).to.be.rejectedWith("Already requested or registered");
    });
  });

  describe("Multiple Users Scenario", function () {
    it("Should handle multiple users with different LMS IDs", async function () {
      const { LMS_Elemes, oracle, user1, user2 } =
        await loadFixture(deployLMSElemes);
      const lmsid1 =
        "0x1111111111111111111111111111111111111111111111111111111111111111";
      const lmsid2 =
        "0x2222222222222222222222222222222222222222222222222222222222222222";

      // Both users request registration with different LMS IDs
      await LMS_Elemes.write.register([lmsid1], { account: user1.account });
      await LMS_Elemes.write.register([lmsid2], { account: user2.account });

      // Oracle assigns different LMS IDs
      await LMS_Elemes.write.assignLMSid([user1.account.address, lmsid1], {
        account: oracle.account,
      });
      await LMS_Elemes.write.assignLMSid([user2.account.address, lmsid2], {
        account: oracle.account,
      });

      // Both should be registered with correct LMS IDs
      expect(await LMS_Elemes.read.IsRegistered([user1.account.address])).to.be
        .true;
      expect(await LMS_Elemes.read.IsRegistered([user2.account.address])).to.be
        .true;
      expect(await LMS_Elemes.read.getLMSid([user1.account.address])).to.equal(
        lmsid1,
      );
      expect(await LMS_Elemes.read.getLMSid([user2.account.address])).to.equal(
        lmsid2,
      );
    });
  });
});
