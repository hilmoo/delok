import {
  delokCertificateAbi,
  delokCertificateAddress,
  lmsElemesAbi,
  lmsElemesAddress,
} from "./abi";
import { client, publicClient } from "./client";
import { getGrade, uploadFinalCid, uploadPdfToIpfs } from "./utils-cert";
import { handleRegistrationRequest } from "./utils-register";

publicClient.watchContractEvent({
  address: lmsElemesAddress[1337],
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
    });
  },
});

publicClient.watchContractEvent({
  address: delokCertificateAddress[1337],
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

      const grade = await getGrade({
        userId: userAddress,
        examId: courseId.toString(),
      });

      if (!grade) {
        console.error(
          `No grade found for user ${userAddress} in course ${courseId}`,
        );
        return;
      }

      const pdfCid = await uploadPdfToIpfs({
        userId: userAddress,
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
        address: delokCertificateAddress[1337],
        abi: delokCertificateAbi,
        functionName: "mintCertificate_Elemes",
        args: [finalCid, userAddress, courseId],
      });
    });
  },
});
