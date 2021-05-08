/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import StatusViewModal from "../../layout/Modal/StatusViewModal";
import { Table, Button } from "reactstrap";
import axios from 'axios';

export default function AdminView() {
  const [request, setRequest] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/data")
      .then((res) => {
        setRequest(res.data);
      });
  }, [success]);

  const handleView = (id) => {
    const currentData = request.find((item) => item.id === id);
    setViewData(currentData);
    setShowViewModal(true);
  };

  const handleCloseView = () => {
    setViewData(null);
    setShowViewModal(false);
  };

  const handleAction = (action, id) => {
    const findData = request.find(item => item.id === id);
    const currentData = {...findData, status : action};
    axios.put(`http://localhost:8080/data/${id}`, currentData)
      .then((res) => {
        setSuccess(!success);
      });
  };

  return (
    <>
      <div className={styles.mainBar}>
        <header className={styles.title}>Admin View</header>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
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
                <td>{item.employee_name}</td>
                <td>{item.num_of_days}</td>
                <td>{item.leave_range}</td>
                <td>{item.status}</td>
                <td>
                  {item.status === "Pending" && (
                    <>
                      <Button className="btn btn-success mr-2" onClick={() => handleAction("Approved", item.id)}>
                        Approve
                      </Button>
                      <Button className="btn btn-danger mr-2" onClick={() => handleAction("Rejected", item.id)}>
                        Reject
                      </Button>
                    </>
                  )}
                  <Button className="btn btn-info mr-2" onClick={() => handleView(item.id)}>
                    View
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <StatusViewModal
        showViewModal={showViewModal}
        handleClose={handleCloseView}
        data={viewData}
      />
    </>
  );
};
