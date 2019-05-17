import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import store from "./store";
import "./App.css";
import Landing from "./components/games/Landing";
import SupportHome from "./components/support/SupportHome";
import ServiceHome from "./components/service/ServiceHome";
import QuestionQuery from "./components/service/query/QuestionQuery";
import QuestionList from "./components/service/query/QuestionList";
import QuestionView from "./components/service/view/QuestionView";

import ReportQuestion from "./components/service/create/ReportQuestion";

import FileUpload from "./components/FileUpload";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Landing} />
            <Route exact path="/service_quick" component={ServiceHome} />
            <Route exact path="/service/:game_id" component={ServiceHome} />

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

            <Route exact path="/upload" component={FileUpload} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
