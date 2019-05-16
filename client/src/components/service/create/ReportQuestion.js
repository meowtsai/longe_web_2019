import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import { renderForm } from "../../../actions/reportActions";
import Spinner from "../../common/Spinner";
//import { verifyQuestionToken } from "../../../actions/questionActions";

//import queryString from "query-string";
import WebForm from "./WebForm";
import InGameForm from "./InGameForm";
ReactModal.setAppElement("#root");
class ReportQuestion extends Component {
  constructor(props) {
    //console.log(props);
    super(props);
    this.state = {
      errors: "",
      loading: false,
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.props.history.push(
      `/service/${this.props.match.params.game_id}/view/${
        this.props.report.create_result.question_id
      }`
    );
  }

  componentDidMount() {
    //console.log("componentDidMount");
    this.props.renderForm(this.props.match.params.game_id);
    //this.setState({ showModal: false });
    // const search_values = queryString.parse(this.props.location.search);
    // console.log("this.props.service", this.props.service);
    // if (this.props.service.is_in_game) {
    //   console.log("is_in_game");
    //   this.props.verifyQuestionToken();
    // } else {

    // }
  }
  componentWillReceiveProps(nextProps) {
    //console.log(nextProps);
    if (nextProps.report) {
      if (nextProps.report.create_result.question_id) {
        this.handleOpenModal();
      } else {
        this.setState({ showModal: false });
      }

      //this.setState({ question: nextProps.service.question });
    }
  }

  render() {
    const { game, question_types, user, faq } = this.props.report.settings;
    const { loading } = this.props.report;
    const { question_id, check_id } = this.props.report.create_result;

    let formContent;

    if (game && question_types) {
      if (user) {
        formContent = (
          <InGameForm
            user={user}
            game={game}
            question_types={question_types}
            faq={faq}
          />
        );
      } else {
        formContent = (
          <WebForm game={game} question_types={question_types} faq={faq} />
        );
      }
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6 m-auto">
            <h4 className="text-center mt-5">線上回報</h4>
            <small className="d-block mb-3 text-center">請填寫以下資訊</small>

            {loading ? (
              <Spinner />
            ) : (
              <div>
                {formContent}
                <ReactModal
                  isOpen={this.state.showModal}
                  contentLabel=""
                  style={{ overlay: { zIndex: 10 } }}
                >
                  <h3 className="text-center">客服中心 提問結果</h3>
                  <hr />
                  <div className="row">
                    <div className="col-sm-12 col-md-4 m-auto">
                      <div className="alert alert-success">
                        <strong>回報單 #{question_id} 提問成功</strong>
                        <br />
                        我們已經傳送郵件到您的mail，
                        <br />
                        後續追蹤客服請用提問mail或手機及以下代碼查詢：
                        <font color="red">
                          <b>{check_id}</b>
                        </font>
                      </div>

                      <button
                        onClick={this.handleCloseModal}
                        className="btn btn-primary m-auto"
                      >
                        我知道了
                      </button>
                    </div>
                  </div>
                </ReactModal>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

ReportQuestion.propTypes = {
  renderForm: PropTypes.func.isRequired,
  errors: PropTypes.object
};
const mapStateToProps = state => ({
  report: state.report,
  errors: state.errors,
  service: state.service
});
export default connect(
  mapStateToProps,
  { renderForm }
)(ReportQuestion);
