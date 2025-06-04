import { createKuboRPCClient } from "kubo-rpc-client";

interface UploadProps {
  userId: string;
  examId: string;
}
export async function uploadPdfToIpfs({ userId, examId }: UploadProps) {
  const client = createKuboRPCClient({
    url: process.env.KUBO_RPC_DOCKER,
  });

  const response = await fetch(
    `${process.env.ELEMES_URL_DOCKER}/api/oracle/cert/${userId}/${examId}`,
    {
      headers: {
        "X-Is-oracle": process.env.ORACLE_HEADER || "1",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }

  const pdfBuffer = await response.arrayBuffer();

  const contentDisposition = response.headers.get("Content-Disposition");
  const fileName = contentDisposition
    ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
    : "certificate.pdf";

  const { cid } = await client.add({
    path: fileName,
    content: new Uint8Array(pdfBuffer),
  });

  console.log(`PDF uploaded to IPFS with CID: ${cid.toV1().toString()}`);

  return cid.toV1().toString();
}

// uploadPdfToIpfs({
//   userId: "hudk0hgu2w59sTD0twjchZgpJQyom4c6",
//   examId: "1",
// }).catch(console.error);

interface GetGradeProps {
  userId: string;
  examId: string;
}

interface GradeResponse {
  id: number;
  userId: string;
  examId: number;
  submittedAt: string;
  grade: number;
}

export async function getGrade({
  userId,
  examId,
}: GetGradeProps): Promise<GradeResponse | null> {
  const response = await fetch(
    `${process.env.ELEMES_URL_DOCKER}/api/oracle/data/${userId}/grade/${examId}`,
    {
      headers: {
        "X-Is-oracle": process.env.ORACLE_HEADER || "1",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch grade: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data) {
    return null;
  }

  return data as GradeResponse;
}

// getGrade({
//   userId: "hudk0hgu2w59sTD0twjchZgpJQyom4c6",
//   courseId: "2",
// }).catch(console.error);

interface UploadFinalCidProps {
  id: number;
  userId: string;
  examId: number;
  submittedAt: string;
  grade: number;
  pdfCid: string;
}
export async function uploadFinalCid(data: UploadFinalCidProps) {
  const client = createKuboRPCClient({
    url: process.env.KUBO_RPC_DOCKER,
  });

  const { cid } = await client.add({
    path: `final-cid-${data.userId}-${data.examId}.json`,
    content: Buffer.from(JSON.stringify(data)),
  });

  console.log(`PDF uploaded to IPFS with CID: ${cid.toV1().toString()}`);

  return cid.toV1().toString();
}

// uploadFinalCid({
//   id: 1,
//   userId: "hudk0hgu2w59sTD0twjchZgpJQyom4c6",
//   examId: 2,
//   submittedAt: "2023-10-01T00:00:00Z",
//   grade: 95,
//   pdfCid: "QmXyz123",
// }).catch(console.error);
