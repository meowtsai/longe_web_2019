import React, { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";

import classnames from "classnames";
import ReportInput from "./ReportInput";
import TaiwanAddressPick from "../../common/TaiwanAddressPick";
const ReportForm2ndPart = ({
  gameId,
  onSubmitReport,
  prevReport,
  products,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    setError,
    watch,
    setValue,
  } = useForm(); // initialise the hook
  const watchInvoiceOption = watch("invoiceOption", "donate"); // you can supply default value as second argument
  const [area, setArea] = useState("");
  const notePlaceholderText =
    gameId === "g66naxx2tw"
      ? "有需要註記給瑞秋的都可以填上 "
      : "有需要註記給小管家的都可以填上 ";

  //console.log("errors", errors);
  const onSubmit = (data) => {
    //console.log("area", area);
    if (area === "" && watchInvoiceOption === "paper") {
      setError("area", {
        type: "manual",
        message: "請選擇居住地區",
      });
      return;
    }

    const addInfo =
      watchInvoiceOption === "donate" ? { area: "", address: "" } : { area };
    //console.log({ ...data, ...addInfo });
    //return;
    onSubmitReport({ ...data, ...addInfo });
    //onNextStepClick({ ...data, area, game_id: gameId });
  };

  useEffect(() => {
    if (prevReport.server_id) {
      // console.log("fetchServerData", prevReport);
      setValue("wireCode", prevReport.wire_code);
      setValue("wireName", prevReport.wire_name);
    }
  }, [setValue, prevReport]);
  const onAddressChange = (value) => {
    //console.log("onAddressChange value", value);
    setArea(value);
  };
  return (
    <form className="card border-info mb-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="card-header  border-info">第二步: 本次匯款資料回報</div>
      <div className="card-body text-info">
        <ReportInput
          type="select"
          name="productId"
          label="方案"
          symbol="🎁"
          register={register({
            required: "請選擇購買方案",
          })}
          error={errors.productId}
          options={[
            { label: "請選擇購買方案", value: "" },
            ...products.map((option) => ({
              label: option.title + " - " + option.product_desc,
              value: option.product_id,
            })),
          ]}
        />
        <ReportInput
          type="number"
          name="qty"
          label="數量"
          symbol="#️⃣"
          register={register({
            required: "輸入數量",
            min: { value: 1, message: "至少要一個阿" },
            max: {
              value: gameId === "g66naxx2tw" ? 1 : 10,
              message: "不要超過太多阿",
            },
          })}
          error={errors.qty}
        />
        <ReportInput
          type="text"
          name="wireCode"
          label="匯款帳號後五碼"
          symbol="🧾"
          register={register({
            required: "輸入匯款帳號後五碼",
          })}
          error={errors.wireCode}
          placeholder="輸入您匯款使用帳號的後五碼"
        />
        <ReportInput
          type="datetime-local"
          name="wireTime"
          label="匯款時間"
          symbol="🕙"
          register={register({
            required: "輸入匯款時間",
          })}
          error={errors.wireTime}
          placeholder="輸入匯款時間"
        />
        <ReportInput
          type="number"
          name="wireAmount"
          label="匯款金額"
          symbol="💲"
          register={register({
            required: "輸入匯款金額",
            min: 3000,
          })}
          error={errors.wireAmount}
        />
        <ReportInput
          type="text"
          name="wireName"
          label="匯款戶名"
          symbol="👤"
          register={register({
            required: "輸入匯款戶名",
          })}
          error={errors.wireName}
          placeholder="輸入匯款帳戶名稱"
        />
        <ReportInput
          type="text"
          name="bankName"
          label="銀行名稱"
          symbol="🏦"
          register={register({
            required: "輸入銀行名稱",
          })}
          error={errors.bankName}
          placeholder="輸入匯款銀行名稱"
        />
        <ReportInput
          type="text"
          name="note"
          label="備註"
          symbol="💬"
          register={register()}
          error={errors.note}
          placeholder={notePlaceholderText}
        />
        <div className="form-group">
          <label htmlFor="invoice" className="col-form-label-sm">
            發票選項(一律開立二聯式發票)
          </label>

          <div className="form-group">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                defaultChecked={true}
                name="invoiceOption"
                ref={register}
                value="donate"
              />
              <label className="form-check-label" htmlFor="invoiceDonate">
                捐贈臺灣環境資訊協會 <br />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://teia.tw/zh-hant/donate/credit"
                >
                  發票徵信
                </a>{" "}
                <small className="text-muted">
                  {" "}
                  ❤️感謝大家和我們一起守護地球🌏
                </small>
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="invoiceOption"
                ref={register}
                value="paper"
                onClick={() => {
                  if (watchInvoiceOption === "paper" && area === "") {
                    setError("address", {
                      type: "manual",
                      message: "請選擇寄送地址縣市地區",
                    });
                  }
                }}
              />
              <label className="form-check-label" htmlFor="invoicePaper">
                紙本發票
              </label>

              {watchInvoiceOption === "paper" && (
                <Fragment>
                  <input
                    className={classnames("form-control form-control-md mb-2", {
                      "is-invalid": errors.recipient,
                    })}
                    type="text"
                    placeholder="收件人姓名"
                    name="recipient"
                    ref={register({ required: true })}
                    maxLength="10"
                  />

                  {errors.recipient && (
                    <div className="invalid-feedback">
                      {errors.recipient?.message}
                    </div>
                  )}

                  <TaiwanAddressPick
                    onChange={onAddressChange}
                    showMainAreaOnly={false}
                  />

                  {errors.area && (
                    <small className="text-danger mt-0 mb-2">
                      {errors.area?.message}
                    </small>
                  )}

                  <input
                    name="address"
                    className={classnames("form-control form-control-md", {
                      "is-invalid": errors.address,
                    })}
                    type="text"
                    placeholder="發票寄送地址"
                    ref={register({ required: true })}
                  />

                  {errors.address && (
                    <div className="invalid-feedback">
                      {errors.address?.message}
                    </div>
                  )}
                  <small className="text-danger d-block">
                    註：我們會在開獎日後幫您對獎，若有中獎便會以掛號寄出紙本發票，讓您可至財政部指定兌領機構兌領獎金。若未中獎則該紙本將予以銷毀。
                  </small>
                </Fragment>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary float-right">
            送出
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReportForm2ndPart;
