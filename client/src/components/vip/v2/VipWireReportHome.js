import React, { useState, useEffect } from "react";
import queryString from "query-string";
import ReportForm from "./ReportForm";
import ReportForm2ndPart from "./ReportForm2ndPart";
import VipResult from "../VipResult";
import VipJumbotron from "../VipJumbotron";
import axios from "axios";

const VipWireReportHome = ({ match, location }) => {
  const gameId = match.params.game_id;
  const [prevReport, setPrevReport] = useState({});
  useEffect(() => {
    async function fetchExistingReport(token) {
      try {
        const result = await axios(`/api/vipv2/prev_report/${token}`);
        //console.log("result", result.data.record);
        setPrevReport(result.data.record);
      } catch (error) {
        console.error(error);
      }
    }
    const search_values = queryString.parse(location.search);
    if (search_values.token) {
      fetchExistingReport(search_values.token);
    }
  }, [location.search]); // Or [] if effect doesn't need props or state

  const [productsOption, setProductsOption] = useState([]);
  useEffect(() => {
    async function fetchProductsData(gameId) {
      const result = await axios(`/api/vip/products/${gameId}`);
      //console.log("result", result.data.products);
      setProductsOption(result.data.products);
    }
    fetchProductsData(gameId);
  }, [gameId]); // Or [] if effect doesn't need props or state

  //const [logData, setLogData] = useState({ report_id: "VP20200825111008wvg" });
  const [logData, setLogData] = useState({});
  const [resultData, setResultData] = useState({});

  if (resultData.report_id) {
    document.title = "龍邑遊戲 - 匯款回報完成";
    return <VipResult record={resultData} />;
  }

  const submitLog = (log) => {
    //e.preventDefault();

    //console.log("submitLog", log);
    //msg: "OK", record: log
    axios
      .post("/api/vipv2/first_step", log)
      .then((res) => {
        console.log(res.data);

        setLogData(res.data?.record);
      })
      .catch((err) => console.log(err.message));
  };
  const submitWireReport = (report) => {
    //e.preventDefault();

    //console.log("submitLog", log);
    //msg: "OK", record: log

    axios
      .post("/api/vipv2/createReport", {
        ...report,
        report_id: logData.report_id,
      })
      .then((res) => {
        console.log(res.data);

        setResultData(res.data?.record);
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="container">
      <VipJumbotron game_id={gameId} products={productsOption} />
      <div className="row">
        <div className="col-lg-3 mt-3"> </div>
        <div className="col-lg-6 col-sm-12 mt-3">
          {logData.report_id ? (
            <ReportForm2ndPart
              gameId={gameId}
              onSubmitReport={submitWireReport}
              prevReport={prevReport}
              products={productsOption}
            />
          ) : (
            <ReportForm
              gameId={gameId}
              onNextStepClick={submitLog}
              prevReport={prevReport}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VipWireReportHome;
