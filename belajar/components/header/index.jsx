import Link from "next/link";
import styles from "./styles.module.css";
import { withAuth } from "../with-auth";
import { MenuItem, Menu, MenuButton, Button, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useQueries } from "@/hooks/useQueries";
import { useMutation } from "@/hooks/useMutation";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
function Header(){

  const { mutate } = useMutation();
  const router = useRouter();
  const userData = useContext(UserContext);
  const HandleLogout = async () => {
    const response = await mutate({
      url:"https://service.pace-unv.cloud/api/logout",
      method: "POST",
      headers: {
        'Authorization':`Bearer ${Cookies.get('user_token')}`,
      },
  });
  if(!response?.success){
    console.log("Logout Gagal");
  } else {
    Cookies.remove("user_token");
    router.push("/login");
  }
  }
  return (
    <div className={styles.header}>
      <ul>
        <li>
          <Link href="/" className="underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/profile" className="underline">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/users" className="underline">
            Users
          </Link>
        </li>
        <li>
          <Link href="/notes" className="underline">
            Notes
          </Link>
        </li>
        <li>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {userData?.name}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => HandleLogout()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </li>
      </ul>
    </div>
  );
}
export default withAuth(Header);