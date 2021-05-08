/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { DateRange } from "react-date-range";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import { useStorage } from "../../contexts/UserContext";
import StatusViewModal from "../../layout/Modal/StatusViewModal";
import axios from "axios";

export default function MemberView() {
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [modal, setModal] = useState(false);
  const [reason, setReason] = useState("");
  const [request, setRequest] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const { user } = useStorage();
  const toggle = () => setModal(!modal);

  useEffect(() => {
    axios.get("http://localhost:8080/data")
      .then((res) => {
        const currentUserData = res.data.filter(item => item.user_id === user.id);
        setRequest(currentUserData);
      });
  }, [user]);

  const handleMakeRequest = () => {
    const { name, id } = user;
    let [{ startDate, endDate }] = date;
    startDate = format(startDate, "yyyy/MM/dd");
    endDate = format(endDate, "yyyy/MM/dd");
    let numOfDay = Math.abs((date[0].startDate - date[0].endDate) / (1000 * 60 * 60 * 24)) + 1;
    let userData = {
      id: uuid(),
      employee_name: name,
      status: "Pending",
      leave_range: startDate + "-" + endDate,
      num_of_days: numOfDay,
      reason: reason,
      user_id: id
    };

    axios.post("http://localhost:8080/data", userData)
      .then((res) => {
        setRequest([...request, res.data]);
      });

    setDate([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    toggle();
  };

  const handleTextChange = (e) => {
    setReason(e.target.value);
  };

  const handleCancel = () => {
    setDate([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);

    toggle();
  };

  const handleView = (id) => {
    const currentData = request.find(item => item.id === id);
    setViewData(currentData);
    setShowViewModal(true); 
  }

  const handleCloseView = () => {
    setViewData(null);
    setShowViewModal(false);
  }

  return (
    <>
      <div className={styles.mainBar}>
        <header className={styles.title}>Member View</header>
        <Button className={styles.btn} color="primary" onClick={toggle}>
          Make Leave Request
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Number of Days</th>
            <th>Date Range</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {request.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.num_of_days}</td>
                <td>{item.leave_range}</td>
                <td>{item.status}</td>
                <td>
                  <Button className="btn btn-info mr-2" onClick={() => handleView(item.id)}>
                    View
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Modal isOpen={modal} toggle={toggle} contentClassName={styles.rootModal}>
        <ModalHeader toggle={toggle}>Leave Request</ModalHeader>
        <ModalBody className={styles.modalBody}>
          <h4 className={styles.fieldHeader}>Select Date</h4>
          <div className={styles.dateBox}>
            <DateRange
              onChange={(item) => setDate([item.selection])}
              moveRangeOnFirstSelection={false}
              showSelectionPreview={true}
              ranges={date}
              startDate={new Date()}
              className={styles.date}
            />
          </div>
          <h4 className={styles.fieldHeader}>Reason For Leave</h4>
          <textarea
            className={styles.reasonText}
            type="text area"
            rows="6"
            cols="47"
            placeholder="Your Answer"
            onChange={handleTextChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleMakeRequest}>
            Confirm
          </Button>
          {" "}
          <Button color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <StatusViewModal 
        showViewModal={showViewModal}
        handleClose={handleCloseView}
        data={viewData}
      />
    </>
  );
};
