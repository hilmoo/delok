import { fromHex } from "viem";
import {
  delokCertificateAbi,
  delokCertificateAddress,
  ilmsElemesAbi,
  lmsElemesAbi,
  lmsElemesAddress,
} from "./abi";
import { chainId, client, publicClient } from "./client";
import { getGrade, uploadFinalCid, uploadPdfToIpfs } from "./utils-cert";
import { handleRegistrationRequest } from "./utils-register";

publicClient.watchContractEvent({
  address: lmsElemesAddress[chainId],
  abi: lmsElemesAbi,
  eventName: "RegistrationRequested",
  onLogs: (logs) => {
    console.log(logs);
    logs.forEach(async (log) => {
      const userAddress = log.args.user;
      const userLmsid = log.args.lmsid;
      if (!userAddress || !userLmsid) {
        console.error("Invalid user address or LMS ID");
        return;
      }
      await handleRegistrationRequest(userAddress, userLmsid);
      console.log(
        `Registration request handled for user: ${userAddress}, LMS ID: ${userLmsid}`,
      );
    });
  },
});

publicClient.watchContractEvent({
  address: delokCertificateAddress[chainId],
  abi: delokCertificateAbi,
  eventName: "MintRequested_Elemes",
  onLogs: (logs) => {
    console.log(logs);
    logs.forEach(async (log) => {
      const userAddress = log.args.user;
      const courseId = log.args.courseId;
      if (!userAddress || !courseId) {
        console.error("Invalid user address or course ID");
        return;
      }

      const userIdHex = await publicClient.readContract({
        address: lmsElemesAddress[chainId],
        abi: ilmsElemesAbi,
        functionName: "getLMSid",
        args: [userAddress],
      });

      if (!userIdHex) {
        console.error(`No LMS ID found for user ${userAddress}`);
        return;
      }

      const userId = fromHex(userIdHex, "string");

      const grade = await getGrade({
        userId,
        examId: courseId.toString(),
      });

      if (!grade) {
        console.error(
          `No grade found for user ${userAddress} in course ${courseId}`,
        );
        return;
      }

      const pdfCid = await uploadPdfToIpfs({
        userId,
        examId: courseId.toString(),
      });

      const finalData = grade && {
        id: grade.id,
        userId: grade.userId,
        examId: grade.examId,
        submittedAt: grade.submittedAt,
        grade: grade.grade,
        pdfCid: pdfCid,
      };

      const finalCid = await uploadFinalCid(finalData);

      client.writeContract({
        address: delokCertificateAddress[chainId],
        abi: delokCertificateAbi,
        functionName: "mintCertificate_Elemes",
        args: [finalCid, userAddress, courseId],
      });

      console.log(
        `Certificate minting requested for user: ${userAddress}, course ID: ${courseId}, LMS ID: ${userId}`,
      );
    });
  },
});
