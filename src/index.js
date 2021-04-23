import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { PersistGate } from 'redux-persist/integration/react'
import { 
  loginWithGoogle, 
  logout, 
  getInfoOfCertificatesIIssuesed, 
  getInfoOfCertificatesIIssuesedInUserPage, 
  getInfoOfCertificates, 
  getInfoOfCertificatesInUserPage, 
  getCertificatesInUserPage, 
  getCertificatesIIssuesedInUserPage, 
  changeTabInUserPageToIssueser, 
  changeTabInUserPageToMyCertificates, 
  fetchProfileInUserPage, 
  changeTabToIssueser, 
  changeTabToMyCertificates, 
  onCopyId, 
  exportFile, 
  closeModal, 
  getMyProfile, 
  getCertificates, 
  getCertificatesIIssuesed, 
  issue, 
  onChangeIssueTo, 
  onChangeCertificateImage, 
  onChangeName, 
  onChangeIcon, 
  onChangeDescription,
  updateUserSetting, 
  onChangeTitle,
  openExportModal,
  closeExportModal,
  copyAccount,
} from "./actions";
import { connect, Provider } from "react-redux";
import store, { persistor } from "./store";
import { withRouter, BrowserRouter as Router } from "react-router-dom";
import CertClient from "./client"

function mapStateToProps(state, props) {
  return state;
}

function mapDispatchToProps(dispatch, props) {
  return {
    getCertificates: () => {
      dispatch(getCertificates());
    },
    getCertificatesIIssuesed: () => {
      dispatch(getCertificatesIIssuesed());
    },
    issue: () => {
      dispatch(issue());
    },
    onChangeIssueTo: (evt) => {
      dispatch(onChangeIssueTo(evt));
    },
    onChangeCertificateImage: (evt) => {
      dispatch(onChangeCertificateImage(evt));
    },
    getMyProfile: () => {
      dispatch(getMyProfile());
    },
    onChangeName: (evt) => {
      dispatch(onChangeName(evt));
    },
    onChangeIcon: (evt) => {
      dispatch(onChangeIcon(evt));
    },
    onChangeTitle: (evt) => {
      dispatch(onChangeTitle(evt));
    },
    onChangeDescription: (evt) => {
      dispatch(onChangeDescription(evt));
    },
    updateUserSetting: () => {
      dispatch(updateUserSetting());
    },
    exportFile: (evt) => {
      dispatch(exportFile(evt));
    },
    openExportModal: () => {
      dispatch(openExportModal());
    },
    closeModal: () => {
      dispatch(closeModal());
    },
    onCopyId: () => {
      dispatch(onCopyId());
    },
    getCertificatesInUserPage: (address) => {
      dispatch(getCertificatesInUserPage(address));
    },
    getCertificatesIIssuesedInUserPage: (address) => {
      dispatch(getCertificatesIIssuesedInUserPage(address));
    },
    changeTabToIssueser: () => {
      dispatch(getCertificatesIIssuesed());
    },
    changeTabToMyCertificates: () => {
      dispatch(getCertificates());
    },
    changeTabInUserPageToIssueser: (address) => {
      dispatch(getCertificatesIIssuesedInUserPage(address));
    },
    changeTabInUserPageToMyCertificates: () => {
      dispatch(changeTabInUserPageToMyCertificates());
    },
    fetchProfileInUserPage: (address) => {
      dispatch(fetchProfileInUserPage(address));
    },
    getInfoOfCertificates: () => {
      dispatch(getInfoOfCertificates());
    },
    getInfoOfCertificatesIIssuesed: () => {
      dispatch(getInfoOfCertificatesIIssuesed());
    },
    getInfoOfCertificatesIIssuesedInUserPage: () => {
      dispatch(getInfoOfCertificatesIIssuesedInUserPage());
    },
    getInfoOfCertificatesInUserPage: () => {
      dispatch(getInfoOfCertificatesInUserPage());
    },
    logout: () => {
      dispatch(logout());
    },
    loginWithGoogle: () => {
      dispatch(loginWithGoogle());
    },
    closeExportModal: () => {
      dispatch(closeExportModal());
    },
    copyAccount: () => {
      dispatch(copyAccount());
    }
  }
}

const RxApp = connect(mapStateToProps, mapDispatchToProps)(withRouter(App));

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <RxApp />
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
