import React, { useState, useEffect } from "react";
import styles from "./statusView.module.scss";
import { DateRange } from "react-date-range";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

export default function StatusViewModal({data, handleClose, showViewModal}) {  
  const [date, setDate] = useState([{}]);
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [num, setNum] = useState(null);

  const statusColor = { Pending: "orange", Approved: "green", Rejected: "red" };

  useEffect(() => {
    if(data){
      const { leave_range } = data;
      setReason(data.reason);
      setStatus(data.status);
      setNum(data.num_of_days);
      
      var dateValue = leave_range.split("-");
      setDate([
        { 
          startDate: new Date(dateValue[0]),
          endDate: new Date(dateValue[1]),
          key: "selection",
          disabled: true,
        },
      ]);
    }
  }, [data]);

  return (
    <Modal
      isOpen={showViewModal}
      toggle={handleClose}
      contentClassName={styles.rootModal}
    >
      <ModalHeader toggle={handleClose}>Leave Request</ModalHeader>
      <ModalBody className={styles.modalBody}>
        <h4 className={styles.fieldHeader}>Select Date</h4>
        <div className={styles.dateBox}>
          <DateRange
            moveRangeOnFirstSelection={false}
            showSelectionPreview={true}
            ranges={date}
            startDate={new Date()}
            rangeColors={[statusColor[status]]}
            className={styles.date}
          />
        </div>
        <div className={styles.dayNumber}>
          <label className={styles.label}>
            Number Of Days:
            {" "}
            {num}
          </label>
        </div>
        <h4 className={styles.fieldHeader}>Reason For Leave</h4>
        <textarea
          className={styles.reasonText}
          type="text area"
          rows="6"
          cols="47"
          placeholder="Your Answer"
          value={reason}
          disabled={true}
        />
      </ModalBody>
    </Modal>
  );
};
