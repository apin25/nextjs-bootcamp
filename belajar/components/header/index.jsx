import Link from "next/link";
import styles from "./styles.module.css";
import { withAuth } from "../with-auth";
function Header(){
  return(
    <div className={styles.header}>
      <ul>
        <li><Link href="/" className="underline">Home</Link></li>
        <li><Link href="/profile" className="underline">Profile</Link></li>
        <li><Link href="/users" className="underline">Users</Link></li>
      </ul>
    </div>
  )
}
export default withAuth(Header);