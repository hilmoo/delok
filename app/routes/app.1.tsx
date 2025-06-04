import {
  Button,
  Container,
  Divider,
  Fieldset,
  Group,
  Paper,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { useState } from "react";
import { redirect } from "react-router";
import { fromHex, toHex } from "viem";
import { BaseError, useAccount, useWriteContract } from "wagmi";
import {
  delokCertificateAbi,
  delokCertificateAddress,
  lmsElemesAbi,
  lmsElemesAddress,
} from "~/abi";
import { getSession } from "~/lib/sessions";
import type { ExamData } from "~/types/lms";
import { chainId, publicClient } from "~/wagmi-config";
import type { Route } from "./+types/app.1";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("address")) {
    return redirect("/");
  }

  const examData: ExamData[] = await ofetch(
    process.env.ELEMES_URL_DOCKER + "/api/exams",
    { parseResponse: JSON.parse },
  );

  const VITE_ELEMES_URL =
    process.env.VITE_ELEMES_URL || "http://localhost:3000";

  return { examData, VITE_ELEMES_URL };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { examData, VITE_ELEMES_URL } = loaderData;
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const [lmsId, setLmsId] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const { address } = useAccount();
  const [successReg, setSuccessReg] = useState("");
  const [successMint, setSuccessMint] = useState("");

  const mutationRegisterContract = useMutation({
    mutationFn: async () => {
      if (!lmsId) {
        throw new Error("LMS ID is required");
      }
      const lmsIdHex = toHex(lmsId);
      const result = writeContract({
        address: lmsElemesAddress[chainId],
        abi: lmsElemesAbi,
        functionName: "register",
        args: [toHex(lmsId)],
      });
    },
    onSuccess: () => {
      console.log("Registration successful");
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  const mutationrequestCertificate = useMutation({
    mutationFn: async (courseId: number) => {
      if (!courseId) {
        throw new Error("Course ID is required");
      }
      const courseId256 = BigInt(courseId);
      writeContract({
        address: delokCertificateAddress[chainId],
        abi: delokCertificateAbi,
        functionName: "requestMintCertificate_Elemes",
        args: [courseId256],
      });
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log("Certificate request successful");
    },
    onError: (error) => {
      console.error("Certificate request failed:", error);
    },
  });

  const mutationGetTokenUri = useMutation({
    mutationFn: async () => {
      if (!tokenId) {
        throw new Error("Token URI is required");
      }
      const tokenUri = await publicClient.readContract({
        address: delokCertificateAddress[chainId],
        abi: delokCertificateAbi,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
      });
      setTokenUri(tokenUri);
    },
    onSuccess: () => {
      console.log("Token URI retrieval successful");
    },
    onError: (error) => {
      console.error("Token URI retrieval failed:", error);
      setTokenUri("");
    },
  });

  publicClient.watchContractEvent({
    address: lmsElemesAddress[chainId],
    abi: lmsElemesAbi,
    eventName: "UserRegistered",
    onLogs: (logs) => {
      logs.forEach(async (log) => {
        const userAddress = log.args.user;
        const userLmsid = log.args.lmsid;
        if (!userAddress || !userLmsid) {
          console.error("Invalid log data:", log);
          return;
        }
        if (userAddress == address) {
          console.log(
            `User ${userAddress} registered with LMS ID ${fromHex(userLmsid, "string")}`,
          );
          setSuccessReg(
            `User ${userAddress} registered with LMS ID ${fromHex(userLmsid, "string")}`,
          );
        }
      });
    },
  });

  publicClient.watchContractEvent({
    address: delokCertificateAddress[chainId],
    abi: delokCertificateAbi,
    eventName: "TokenMinted_Elemes",
    onLogs: (logs) => {
      logs.forEach(async (log) => {
        const userAddress = log.args.user;
        const tokenId = log.args.tokenId;
        const courseId = log.args.courseId;
        console.log(
          `TokenMinted_Elemes event: user=${userAddress}, tokenId=${tokenId}, courseId=${courseId}`,
        );
        if (
          userAddress === undefined ||
          tokenId === undefined ||
          courseId === undefined
        ) {
          console.error("Invalid log data:", log);
          return;
        }
        if (userAddress == address) {
          console.log(
            `Successfully minted token (id: ${tokenId}) for user ${userAddress} with LMS for course ID ${courseId}`,
          );
          setSuccessMint(
            `Successfully minted token (id: ${tokenId}) for user ${userAddress} with LMS for course ID ${courseId}`,
          );
        }
      });
    },
  });

  return (
    <Container py="xl">
      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <Fieldset legend="Register">
          <TextInput
            label="Your account Id"
            description={`${VITE_ELEMES_URL}/api/data/id`}
            onChange={(e) => setLmsId(e.currentTarget.value)}
          />
          <Button
            mt="md"
            fullWidth
            onClick={() => mutationRegisterContract.mutate()}
            loading={mutationRegisterContract.isPending}
          >
            Register
          </Button>
        </Fieldset>
        <Space h="md" />
        <Text size="sm" c="dimmed">
          Dont mint before actually finishing the exam, otherwise you will not
          able to mint again
        </Text>
        {examData?.map((exam) => (
          <div key={exam.id}>
            <Paper withBorder shadow="sm" px={"md"} py={"sm"} radius="md">
              <Group align={"center"} justify="space-between">
                <Text>{exam.title}</Text>
                <Button
                  onClick={() => mutationrequestCertificate.mutate(exam.id)}
                  loading={mutationrequestCertificate.isPending}
                  bg={"green"}
                >
                  Mint
                </Button>
              </Group>
            </Paper>
            <Divider my="md" />
          </div>
        ))}
      </Paper>
      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <Title order={3}>Transaction Status</Title>
        <Text size="sm" c="dimmed">
          event updated every 5 minutes
        </Text>
        {error && (
          <>
            <Text c={"red"}>
              Error: {(error as BaseError).shortMessage || error.message}
            </Text>
            <Divider h="sm" />
          </>
        )}
        {hash && (
          <>
            <Text c="green" mt="md">
              Transaction Hash: {hash}
            </Text>
            <Divider h="sm" />
          </>
        )}
        {isPending && (
          <>
            <Text c="blue" mt="md">
              Transaction is pending...
            </Text>
            <Divider h="sm" />
          </>
        )}
        {successReg && (
          <>
            <Text c="green" mt="md">
              {successReg}
            </Text>
            <Divider h="sm" />
          </>
        )}
        {successMint && (
          <>
            <Text c="green" mt="md">
              {successMint}
            </Text>
            <Divider h="sm" />
          </>
        )}
        <Divider h="md" />
        <TextInput
          label="Get Token URI"
          onChange={(e) => setTokenId(e.currentTarget.value)}
        />
        <Space h="sm" />
        <Button fullWidth onClick={() => mutationGetTokenUri.mutate()}>
          Get
        </Button>
        <Space h="sm" />
        {tokenUri && <Text>Token URI : {tokenUri}</Text>}
      </Paper>
    </Container>
  );
}
