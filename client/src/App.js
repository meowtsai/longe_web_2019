import React, { Component } from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import store from "./store";
import "./App.css";
import Landing from "./components/games/Landing";
import SupportHome from "./components/support/SupportHome";
import ServiceHome from "./components/service/ServiceHome";
import QuestionQuery from "./components/service/query/QuestionQuery";
import QuestionList from "./components/service/query/QuestionList";
import QuestionView from "./components/service/view/QuestionView";

import ReportQuestion from "./components/service/create/ReportQuestion";
import ConfirmIssue from "./components/service/create/ConfirmIssue";
import ReportHome from "./components/service/create/forms/ReportHome";
import EventSerial from "./components/events/EventSerial";
import EventDeliveroo from "./components/events/EventDeliveroo";
import Complete_agreement from "./components/policies/Complete_agreement";
import SurveyMain from "./components/survey/SurveyMain";
import SurveyLoginScreen from "./components/survey/SurveyLoginScreen";

import VipWireReportHome from "./components/vip/v2/VipWireReportHome";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/service_quick" component={ServiceHome} />
              <Route exact path={`/service/:game_id`} component={ServiceHome} />
              <Redirect
                from={`/wire_report/:game_id`}
                to={`/wire_report_v2/:game_id`}
              />
              {/* <Route exact path="/wire_report/:game_id" component={VipHome} /> */}
              <Route
                path={`/wire_report_v2/:game_id`}
                component={VipWireReportHome}
              />

              <Route exact path="/support" component={SupportHome} />
              <Route
                exact
                path="/service/:game_id/query"
                component={QuestionQuery}
              />
              <Route
                exact
                path="/service/:game_id/list"
                component={QuestionList}
              />

              <Route
                exact
                path="/service/:game_id/view/:q_id"
                component={QuestionView}
              />
              <Route
                exact
                path="/service/:game_id/create"
                component={ReportQuestion}
              />

              <Route
                exact
                path="/service/:game_id/confirm-issue"
                component={ConfirmIssue}
              />
              <Route
                exact
                path="/service/:game_id/report-issue"
                component={ReportHome}
              />

              <Route
                exact
                path="/member/complete_agreement"
                component={Complete_agreement}
              />

              <Route
                exact
                path="/events/event_serial"
                component={EventSerial}
              />
              <Route
                exact
                path="/events/deliveroo"
                component={EventDeliveroo}
              />

              <Route
                exact
                path="/survey/event18/:game_id"
                component={SurveyMain}
              />
              <Route
                exact
                path="/survey/2021/:game_id"
                component={SurveyLoginScreen}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
