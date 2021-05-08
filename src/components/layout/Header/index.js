import React, { useState } from "react";
import styles from "./index.module.scss";
import { useStorage } from "../../contexts/UserContext";
import { withRouter } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const Header = ({ history }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { dispatch, user } = useStorage();

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({
      type: "RESET_USER",
    });
    history.push("/login");
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>Leave Management Utility</header>
      <div className={styles.name}>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>{user.name}</DropdownToggle>
          <DropdownMenu className={styles.dropDown}>
            <DropdownItem onClick={handleLogout}>Log Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default withRouter(Header);
