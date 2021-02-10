import "./App.css";
import "./form.css";
import React from "react";
import * as components from "./components";
import { getCertificate, getCertificates, CertClient } from "./eos";

const resultRef = React.createRef();

const rpcHost = "http://localhost:8888";
const privateKey = window.prompt("enter private key of your account", "");
let client = null;
if (privateKey !== null) {
  try {
    client = new CertClient(privateKey, rpcHost);
  } catch (err) {
    console.error(err);
  }
}

function showErrorMessage(message) {
  document.getElementById("error-message").innerText = message;
}

function showMessage(message) {
  document.getElementById("message").innerText = message;
}

async function createCertificate() {
  if (client === null) {
    return;
  }
  try {
    await client._createCertificate();
  } catch (err) {
    showErrorMessage("Failed to issue a certificate.");
    return;
  }
  showMessage("Successfully completed issuesing a certificate.");
}

function getUrlQueries() {
  let queryStr = window.location.search.slice(1);
  let queries = {};
  if (!queryStr) {
    return queries;
  }
  queryStr.split("&").forEach(function (queryStr) {
    var queryArr = queryStr.split("=");
    queries[queryArr[0]] = queryArr[1];
  });
  return queries;
}
function refreshCertificates(certificates) {
  resultRef.current.setState({ certificates: [] });
  resultRef.current.setState({ certificates: certificates });
}

async function verifyCertificates(certificates) {
  if (client !== null) {
    const withVerified = async (certificates) => {
      let promises = certificates.map((certificate) => {
        return client.verifyCertificate(holder, certificate.key);
      });
      return await Promise.all(promises);
    };
    const verifieds = await withVerified(certificates);
    for (let i = 0; i < certificates.length; i++) {
      certificates[i].verified = verifieds[i];
    }
  }
}

async function showCertificate(queries) {
  const key = parseInt(queries["key"]);
  const holder = queries["user"];
  let certificate;
  try {
    certificate = await getCertificate(holder, key);
  } catch (err) {
    console.error(err);
    return;
  }
  let certificates = [certificate];
  await verifyCertificates(certificates);
  refreshCertificates(certificates);
}
async function showCertificates() {
  const receiver = document.getElementById("holder").value;
  try {
    let certificates = await getCertificates(receiver);
    await verifyCertificates(certificates);
    refreshCertificates(certificates);
  } catch (err) {
    console.error(err);
    showErrorMessage("Failed to fetch certificates.");
  }
}

function resetTabSelected() {
  document.getElementById("issue-tab").classList.remove("selected");
  document.getElementById("show-tab").classList.remove("selected");
  document.getElementById("issue").classList.remove("hidden");
  document.getElementById("show").classList.remove("hidden");
}

function changeTabToIssue() {
  resetTabSelected();
  document.getElementById("issue-tab").classList.add("selected");
  document.getElementById("show").classList.add("hidden");
}

function changeTabToShow() {
  resetTabSelected();
  document.getElementById("show-tab").classList.add("selected");
  document.getElementById("issue").classList.add("hidden");
}

class App extends React.Component {
  componentDidMount() {
    const queries = getUrlQueries();
    if ("key" in queries && "user" in queries) {
      showCertificate(queries);
    }
  }
  render() {
    return (
      <div className="App">
        <div className="main">
          <p id="error-message"></p>
          <p id="message"></p>
          <div className="tabs">
            <div
              className="issue-tab tab"
              id="issue-tab"
              onClick={changeTabToIssue}
            >
              Issue
            </div>
            <div
              className="show-tab tab selected"
              id="show-tab"
              onClick={changeTabToShow}
            >
              Show
            </div>
          </div>
          <br />
          <div id="show" className="show" class="form-group">
            <h2>Show Certificates</h2>
            <label>Certificate Holder</label>
            <input
              type="text"
              id="holder"
              class="form-control"
              placeholder="alice"
            />
            <input
              type="button"
              value="Show certificates"
              onClick={showCertificates}
              id="show-cert"
              class="form-control"
            />
            <br />
            <components.CertificateComponents
              ref={resultRef}
              certificates={[]}
            />
          </div>
          <div className="issue" class="form-group hidden" id="issue">
            <h2>Issue Certificate</h2>
            <label for="issueser">issueser</label>
            <input
              type="text"
              id="issueser"
              class="form-control"
              placeholder="alice"
            />
            <label for="receiver">receiver</label>
            <input
              type="text"
              id="receiver"
              class="form-control"
              placeholder="bob"
            />
            <label>Certificate Image</label>
            <input type="file" id="cert-image" class="form-control" />
            <br />
            <input
              type="button"
              id="issue-button"
              class="form-control"
              value="Issue"
              onClick={createCertificate}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
