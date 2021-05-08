import React, { useState, useRef, useEffect } from "react";
import data from "../../../data/user.json";
import styles from "./index.module.scss";
import cx from "classnames";
import { useStorage } from "../../contexts/UserContext";
import { withRouter } from "react-router-dom";

const LoginPage = ({ history }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);
  const iRef = useRef(null);

  const { dispatch } = useStorage();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isAttemptingLogin) {
      return;
    }
    if (!email) {
      setEmailError("Please enter your email");
      return;
    }
    if (!password) {
      setPasswordError("Please enter your password");
      return;
    }
    setIsAttemptingLogin(true);
    setLoading(true);
    setTimeout(() => {
      const userData = data.find(
        (item) => item.email === email && item.password === password
      );
      if (userData) {
        let data = { ...userData };
        delete data.password;
        dispatch({
          type: "SET_USER",
          payload: data,
        });
        history.push("/");
        setEmail("");
      }

      if (!userData) {
        setError("Login Failed");
      }

      setIsAttemptingLogin(false);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    iRef.current && iRef.current.focus();
    // return() => {
    //     setEmail('');
    //     setPassword('');
    //     setEmailError('');
    //     setError('');
    //     setPasswordError('');
    // }
  }, []);

  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
    setError("");
  };
  const handlePasswordInputChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
    setError("");
  };
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Login</h1>
        </header>
        <form className={styles.body} onSubmit={handleFormSubmit}>
          <div className={cx(styles.mainRoot, { [styles.hasValue]: email })}>
            <input
              className={styles.input}
              type="email"
              value={email}
              ref={iRef}
              onChange={handleEmailInputChange}
              disabled={isAttemptingLogin}
            />
            <label className={styles.label}>Email Address</label>
            {emailError ? (
              <p className={styles.errorText}> {emailError}</p>
            ) : null}
          </div>
          <div className={cx(styles.mainRoot, { [styles.hasValue]: password })}>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={handlePasswordInputChange}
              disabled={isAttemptingLogin}
            />
            <label className={styles.label}>Password</label>
            {passwordError ? (
              <p className={styles.errorText}> {passwordError}</p>
            ) : null}
          </div>
          {error ? <p className={styles.errorText}> {error}</p> : null}
          <button className={styles.btn}>
            {loading && <i className="fa fa-refresh fa-spin"></i>} Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default withRouter(LoginPage);
