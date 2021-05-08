import React from "react";
import styles from "./index.module.scss";
import { useStorage } from "../../contexts/UserContext";
import Header from "../../layout/Header/index";
import AdminView from "../AdminView/index";
import MemberView from "../MemberView/index";

export default function DashBoard() {
  const { user } = useStorage();
  const { role } = user;
  return (
    <>
      <Header />
      <div className={styles.root}>
        {role === "admin" ? (
          <AdminView />
        ) : (
          <MemberView />
        )}
      </div>
    </>
  );
};
