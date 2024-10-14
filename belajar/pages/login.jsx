import { useState } from "react";
import { Flex, FormControl, Heading, Stack, useToast, Input, Button } from "@chakra-ui/react";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
export default function Login(){
    const { mutate } = useMutation();
    const  toast  = useToast();
    const router = useRouter();
    const [payload,setPayload] = useState({
        email:"",
        password:""
    });
const HandleSubmit = async () => {
  const response = await mutate({
    url: "https://service.pace-unv.cloud/api/login",
    payload,
  });

  console.log("Mutation response:", response); // Log the entire mutation response

  if (!response?.success) {
    toast({
      title: "Login Gagal",
      description: "Email dan password salah",
      status: "error",
      duration: 2000,
      isCloseable: true,
      position: "top",
    });
  } else {
    const token = response?.data?.data?.token;
    const expiresAt = new Date(response?.data?.data?.expires_at);

    console.log("Extracted token:", token);
    console.log("Expires at:", expiresAt);

    Cookies.set("user_token", token, {
      expires: expiresAt,
      path: "/",
    });

    router.push("/");
  }
};


    return (
      <Flex alignItems="center" justifyContent="center">
        <Stack direction="column">
          <Heading as="h4">LOGIN</Heading>
          <FormControl>
            <Input placeholder="email" value={payload?.email} onChange={(event)=> setPayload({...payload, email: event.target.value})} />
          </FormControl>
          <FormControl>
            <Input placeholder="password" type="password" value={payload?.password} onChange={(event)=> setPayload({...payload, password: event.target.value})} />
          </FormControl>
          <FormControl>
            <Button onClick={() => HandleSubmit()}>Login</Button>
          </FormControl>
        </Stack>
      </Flex>
    );
}