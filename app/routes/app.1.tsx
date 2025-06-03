import {
  Button,
  Container,
  Fieldset,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { redirect } from "react-router";
import { decodeErrorResult, toHex } from "viem";
import { BaseError, useWriteContract } from "wagmi";
import {
  delokCertificateAbi,
  delokCertificateAddress,
  lmsElemesAbi,
  lmsElemesAddress,
} from "~/abi";
import { getSession } from "~/lib/sessions";
import type { Route } from "./+types/app._index";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("address")) {
    return redirect("/");
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const [lmsId, setLmsId] = useState("");

  const mutationRegisterContract = useMutation({
    mutationFn: async () => {
      if (!lmsId) {
        throw new Error("LMS ID is required");
      }
      const lmsIdHex = toHex(lmsId);
      console.log("LMS ID in hex:", lmsId);
      console.log("Registering LMS ID:", lmsIdHex);
      writeContract({
        address: lmsElemesAddress[1337],
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
        address: delokCertificateAddress[1337],
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

  return (
    <Container py="xl">
      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <Fieldset legend="Register">
          <TextInput
            label="Your account Id"
            description="http://localhost:4000/api/data/id"
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
        <Fieldset legend="Minting Certificate">
          <Text>Make sure already create 1 course (exam)</Text>
          <Button
            mt="md"
            fullWidth
            onClick={() => mutationrequestCertificate.mutate(1)}
            loading={mutationrequestCertificate.isPending}
          >
            Course 1
          </Button>
        </Fieldset>
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
        {hash && (
          <Text c="green" mt="md">
            Transaction Hash: {hash}
          </Text>
        )}
        {isPending && (
          <Text c="blue" mt="md">
            Transaction is pending...
          </Text>
        )}
      </Paper>
    </Container>
  );
}
