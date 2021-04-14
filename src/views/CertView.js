import React from "react";
import "./Certificate.css";
import { getTextOnIpfs, getImageOnIpfs } from "../image-upload";
import { dateString } from "../util";
import { Link } from "react-router-dom";

class CertViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    const index = parseInt(props.match.params.index);
    this.index = index;
    this.state = {
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
      this.loadImage();
    }
  }
  next() {
    if (this.state.index < this.state.certificates.length - 1) {
      this.setState({
        index: this.state.index + 1,
        verified: null,
      });
      this.loadImage();
    }
  }
  async loadImage() {
    const certificate = this.state.certificates[this.state.index];
    const imageUrl = await getImageOnIpfs(certificate.ipfs);
    this.setState({
      imageUrl
    });
  }
  async loadTitle() {
    const certificate = this.state.certificates[this.state.index];
    const title = await getTextOnIpfs(certificate.title);
    this.setState({
      titleInIpfs: title,
    });
  }
  async loadDescription() {
    const certificate = this.state.certificates[this.state.index];
    const description = await getTextOnIpfs(certificate.description);
    this.setState({
      descriptionInIpfs: description,
    });
  }
  async verifyCertificate() {
    const client = this.props.client;
    const certificate = this.state.certificates[this.state.index];
    const verified = client.verifyCertificate(certificate, client.address);
    this.setState({
      verified: verified,
    });
  }
  componentDidMount() {
    this.loadImage();
    this.loadTitle();
    this.loadDescription();
  }
  render() {
    const certificate = this.props.certificates[this.state.index];
    return (
      <div className="cert-view">
        <div className="cert-view-top">
          <button className="back" onClick={this.back.bind(this)}>＜</button>
          <img src={this.state.imageUrl} className="cert-view-image" alt="GxCert" />
          <button className="next" onClick={this.next.bind(this)}>＞</button>
        </div>
        <div className="cert-view-bottom">
          <button onClick={this.verifyCertificate.bind(this)} className="verify-button">Verify</button>
          <p className="cert-view-title">
            { this.state.verified ? "✅ This certificate is valid." : "" }
            { !this.state.verified && this.state.verified !== null ? "❌ This certificate is invalid." : "" }<br/>
            { this.state.titleInIpfs } by <Link to={"/users/" + certificate.by }>{ !certificate.issueserName ? certificate.by.substr(0, 16) : certificate.issueserName }</Link> { !certificate.to ? "" : "to " + certificate.to.substr(0, 16) } at {
              dateString(new Date(certificate.time * 1000))
            }
          </p>
          <p className="cert-view-description">
            { this.state.descriptionInIpfs }
          </p>
        </div>
      </div>
    );
  }
}

export {
  CertViewComponent
}
