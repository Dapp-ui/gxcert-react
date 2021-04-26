import React from "react";
import "./Certificate.css";
import { getTextOnIpfs, getImageOnIpfs } from "../image-upload";
import { dateString } from "../util";
import { Link } from "react-router-dom";
import NotFoundComponent from "./404";

class CertViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    const index = parseInt(props.match.params.index);
    let address = this.client.address;
    if (props.fromUserPage) {
      address = props.match.params.address;
    }
    this.index = index;
    this.state = {
      address,
      certificates: props.certificates,
      index: index,
      verified: null,
      title: "",
      imageUrl: "",
    }
  }
  back() {
    if (this.state.index > 0) {
      this.setState({
        index: this.state.index - 1,
        verified: null,
      });
    }
  }
  next() {
    if (this.state.index < this.state.certificates.length - 1) {
      this.setState({
        index: this.state.index + 1,
        verified: null,
      });
    }
  }
  componentDidMount() {
    if (this.props.fromUserPage) {
      if (this.props.getCertificates) {
        this.props.getCertificates(this.state.address);
      }
      if (this.props.getCertificatesIIssuesed) {
        this.props.getCertificatesIIssuesed(this.state.address);
      }
    }
  }
  loadDetail() {
    this.loadImage();
    this.loadTitle();
    this.loadDescription();
  }
  async loadImage() {
    if (this.state.index < 0 || this.props.certificates.length <= this.state.index) {
      return;
    }
    const certificate = this.state.certificates[this.state.index];
    if (certificate.imageUrl) {
      this.setState({
        imageUrl: certificate.imageUrl
      });
      return;
    }
    let imageUrl;
    try {
      imageUrl = await getImageOnIpfs(certificate.ipfs);
    } catch(err) {
      console.error(err);
      return;
    }
    this.setState({
      imageUrl
    });
  }
  async loadTitle() {
    if (this.state.index < 0 || this.props.certificates.length <= this.state.index) {
      return;
    }
    const certificate = this.state.certificates[this.state.index];
    if (certificate.titleInIpfs) {
      this.setState({
        titleInIpfs: certificate.titleInIpfs
      });
      return;
    }
    let title;
    try {
      title = await getTextOnIpfs(certificate.title);
    } catch(err) {
      console.error(err);
      this.setState({
        titleInIpfs: "",
      });
      return;
    }
    this.setState({
      titleInIpfs: title,
    });
  }
  async loadDescription() {
    if (this.state.index < 0 || this.props.certificates.length <= this.state.index) {
      return;
    }
    const certificate = this.state.certificates[this.state.index];
    if (certificate.descriptionInIpfs) {
      this.setState({
        descriptionInIpfs: certificate.descriptionInIpfs,
      });
      return;
    }
    let description;
    try {
      description = await getTextOnIpfs(certificate.description);
    } catch(err) {
      console.error(err);
      this.setState({
        descriptionInIpfs: "",
      });
      return;
    }
    this.setState({
      descriptionInIpfs: description,
    });
  }
  async verifyCertificate() {
    const client = this.props.client;
    const certificate = this.state.certificates[this.state.index];
    let verified;
    if (this.props.fromUserPage) {
      verified = client.verifyCertificate(certificate, client.address);
    } else {
      verified = client.verifyCertificate(certificate, this.state.address);
    }
    this.setState({
      verified: verified,
    });
  }
  componentDidMount() {
    this.loadDetail();
  }
  render() {
    if (this.state.index < 0 || this.props.certificates.length <= this.state.index) {
      return (
        <NotFoundComponent />
      );
    }
    const certificate = this.props.certificates[this.state.index];
    return (
      <div className="cert-view">
        <div className="cert-view-top">
          <button className="back" onClick={this.back.bind(this)}>＜</button>
          <img src={certificate.imageUrl} className="cert-view-image" alt="GxCert" />
          <button className="next" onClick={this.next.bind(this)}>＞</button>
        </div>
        <div className="cert-view-bottom">
          <button onClick={this.verifyCertificate.bind(this)} className="verify-button">Verify</button>
          <p className="cert-view-title">
            { this.state.verified ? "✅ This certificate is valid." : "" }
            { !this.state.verified && this.state.verified !== null ? "❌ This certificate is invalid." : "" }<br/>
            { certificate.titleInIpfs }<br/>
            by <Link to={"/users/" + certificate.by }>{ !certificate.issueserName ? certificate.by.substr(0, 16) : certificate.issueserName }</Link> { !certificate.to ? "" : "to " + certificate.to.substr(0, 16) } at {
              dateString(new Date(certificate.time * 1000))
            }
          </p>
          <p className="cert-view-description">
            { certificate.descriptionInIpfs }
          </p>
        </div>
      </div>
    );
  }
}

export {
  CertViewComponent
}
