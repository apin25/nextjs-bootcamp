import Menu from "../menu";
import styles from "./styles.module.css";
import { withAuth } from "../with-auth";
function Header(){
  return(
    <div className={styles.header}>
      <Menu/>
    </div>
  )
}
export default withAuth(Header);