import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import {
  addDataToAPI,
  getDataFromAPI,
  updateDataToAPI,
  deleteDataFromAPI,
} from "../../../config/redux/action";
import "./dashboard.scss";

class Dasboard extends Component {
  state = {
    title: "",
    content: "",
    isUpdate: false,
    nodeId: "",
  };

  handleInputChange = (e) => {
    e.preventDefault();

    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleFormSubmit = () => {
    const { title, content, isUpdate, nodeId } = this.state;
    const { saveDataAPI, updateDataAPI, history } = this.props;
    let date = new Date().getTime();
    const userDataLocal = JSON.parse(localStorage.getItem("userData"));

    if (userDataLocal === null) {
      history.push("/login");
    } else {
      const data = {
        title: title,
        content: content,
        date: date,
        uid: userDataLocal.uid,
      };

      if (isUpdate) {
        data.noteId = nodeId;
        updateDataAPI(data);
        this.resetState();
      } else {
        saveDataAPI(data);
        this.resetState();
      }
    }
  };

  handleNoteUpdate = (noteData, noteId) => {
    this.setState({
      title: noteData.title,
      content: noteData.content,
      isUpdate: true,
      nodeId: noteId,
    });
  };

  handleNoteDelete = (e, noteid) => {
    e.preventDefault();
    e.stopPropagation();
    const { deleteDataAPI, history } = this.props;

    const userDataLocal = JSON.parse(localStorage.getItem("userData"));
    if (userDataLocal !== null) {
      deleteDataAPI(userDataLocal.uid, noteid);
    } else {
      history.push("/login");
    }
  };

  resetState = () => {
    this.setState({
      title: "",
      content: "",
      isUpdate: false,
      nodeId: "",
    });
  };

  componentDidMount() {
    const { getDataAPI, history } = this.props;

    let userDataLocal = null;
    userDataLocal = JSON.parse(localStorage.getItem("userData"));

    if (userDataLocal === null) {
      history.push("/login");
    } else {
      getDataAPI(userDataLocal.uid);
    }
  }

  render() {
    const { userNotes } = this.props;
    const { title, content, isUpdate } = this.state;
    return (
      <div className="container">
        <div className="input-form">
          <input
            placeholder="title"
            className="input-title"
            value={title}
            name="title"
            onChange={(e) => this.handleInputChange(e)}
          />
          <textarea
            placeholder="content"
            className="input-content"
            value={content}
            name="content"
            onChange={(e) => this.handleInputChange(e)}
          />
          <div className="btn-wrapper">
            {isUpdate ? (
              <button className="cancel-btn" onClick={this.resetState}>
                Cancel
              </button>
            ) : null}
            <button className="save-btn" onClick={this.handleFormSubmit}>
              {isUpdate ? "Update" : "Simpan"}
            </button>
          </div>
        </div>

        {userNotes.length > 0 ? (
          <Fragment>
            {userNotes.map((note) => (
              <div
                className="card-content"
                key={note.key}
                onClick={() => this.handleNoteUpdate(note.data, note.key)}
              >
                <span
                  className="close"
                  onClick={(e) => this.handleNoteDelete(e, note.key)}
                >
                  &times;
                </span>
                <p className="title">{note.data.title}</p>
                <p className="date">{note.data.date}</p>
                <p className="content">{note.data.content}</p>
              </div>
            ))}
          </Fragment>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userNotes: state.userNotes,
});

const mapDispatchToProps = (dispatch) => ({
  saveDataAPI: (data) => dispatch(addDataToAPI(data)),
  getDataAPI: (uid) => dispatch(getDataFromAPI(uid)),
  updateDataAPI: (data) => dispatch(updateDataToAPI(data)),
  deleteDataAPI: (uid, noteid) => dispatch(deleteDataFromAPI(uid, noteid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dasboard);
