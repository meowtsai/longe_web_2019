import React from "react";
import TextFieldGroup from "../common/TextFieldGroup";

const CheckID = () => {
  return (
    <>
      <TextFieldGroup
        placeholder="* 帳號 ID"
        name="serial_no"
        type="serial_no"
        value={serial_no}
        onChange={(e) => {
          setSerail(e.target.value);
        }}
        error={errors.serial_no}
        info="請輸入帳號 ID"
      />
    </>
  );
};

export default CheckID;
