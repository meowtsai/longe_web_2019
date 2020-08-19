import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import ReportInput from "./ReportInput";
import moment from "moment";
import axios from "axios";
import TaiwanAddressPick from "../../common/TaiwanAddressPick";
const ReportForm = ({ gameId, onNextStepClick, prevReport }) => {
  const [area, setArea] = useState("");
  const [serverOptions, setServerOptions] = useState([]);
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    setValue,
  } = useForm(); // initialise the hook

  const onSubmit = (data) => {
    //console.log(data);
    if (area === "") {
      setError("area", {
        type: "manual",
        message: "請選擇居住地區",
      });
      return;
    }

    onNextStepClick({ ...data, area, game_id: gameId });
  };

  const roleIdPlaceholderText =
    gameId === "g66naxx2tw" ? "人物帳號ID" : "人物角色ID";
  const roleIdLabelText = `${roleIdPlaceholderText} (${
    gameId === "g66naxx2tw"
      ? "右上方設定點擊進去看到"
      : "偵探大廳右上齒輪設定中的角色數字ID"
  })*`;

  useEffect(() => {
    async function fetchServerData(gameId) {
      const result = await axios(`/api/games/get_servers/${gameId}`);
      setServerOptions(result.data.msg);
      if (result.data.msg.length === 1) {
        setValue("serverId", result.data.msg[0].server_id);
      }
    }
    fetchServerData(gameId);
  }, [setValue, gameId]); // Or [] if effect doesn't need props or state

  useEffect(() => {
    if (prevReport.server_id) {
      // console.log("fetchServerData", prevReport);
      setValue("serverId", prevReport.server_id);
      setValue("gender", prevReport.gender);
      setValue("birthday", moment(prevReport.birthday).format("YYYY-MM-DD"));
      setArea(prevReport.area);
    }
  }, [setValue, prevReport]);

  const onAddressChange = (value) => {
    setArea(value);
    clearErrors("area");
  };

  //console.log("errors", errors);
  return (
    <form className="card border-info mb-3" onSubmit={handleSubmit(onSubmit)}>
      <div class="card-header  border-info">第一步: 個人資料專區</div>
      <div className="card-body text-info">
        <ReportInput
          type="select"
          name="serverId"
          label="伺服器"
          symbol="🖥"
          register={register({
            required: "請選擇伺服器",
          })}
          error={errors.serverId}
          defaultValue={prevReport.server_id}
          options={[
            { label: "請選擇伺服器", value: "" },
            ...serverOptions.map((server) => ({
              label: server.server_name,
              value: server.server_id,
            })),
          ]}
        />

        <ReportInput
          name="roleId"
          label={roleIdLabelText}
          symbol="🔢"
          register={register({
            pattern: {
              value: /^\d{6,8}$/,
              message: "請輸入6~8碼數字",
            },
            required: "請輸入數字ID",
          })}
          placeholder="輸入角色id"
          error={errors.roleId}
          defaultValue={prevReport.role_id}
          readonly={prevReport.role_id ? true : false}
        />
        <ReportInput
          name="charName"
          label="角色名稱"
          symbol="🦸"
          register={register({
            required: "請輸入角色名稱",
          })}
          error={errors.charName}
          placeholder="輸入角色名稱"
          defaultValue={prevReport.char_name}
        />
        <ReportInput
          name="email"
          label="Email"
          symbol="📧"
          register={register({
            required: "輸入您的電子郵件",
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              message: "電子郵件格式不符合",
            },
          })}
          error={errors.email}
          placeholder="輸入您的電子郵件"
          defaultValue={prevReport.email}
        />
        <ReportInput
          name="userPhone"
          label="手機"
          symbol="📱"
          register={register({
            required: "輸入您的手機號碼",
            pattern: {
              value: /^09[0-9]{8}$/,
              message: "手機號碼格式不符合",
            },
          })}
          error={errors.userPhone}
          placeholder="輸入您的手機號碼.09XXXXXXXX"
          defaultValue={prevReport.phone}
        />
        <div className="form-group">
          <label className="col-form-label-sm">居住地區</label>
          <TaiwanAddressPick
            onChange={onAddressChange}
            defaultValue={prevReport.area}
            showMainAreaOnly={true}
          />
        </div>
        <div className="form-group">
          <small className="text-danger">{errors.area?.message}</small>
        </div>
        <ReportInput
          type="select"
          name="gender"
          label="性別"
          symbol="‍⚧️"
          register={register({
            required: "請選擇性別",
          })}
          defaultValue={prevReport.gender}
          error={errors.gender}
          options={[
            { label: "--請選擇--", value: "" },
            { label: "中性", value: "x" },
            { label: "男性", value: "m" },
            { label: "女性", value: "f" },
          ]}
        />

        <ReportInput
          type="date"
          name="birthday"
          label="生日"
          symbol="‍🎂️"
          register={register({
            required: "請選擇出生年月日",
          })}
          error={errors.birthday}
        />

        <button type="submit" className="btn btn-info float-right">
          下一步
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
