import React, { PropTypes } from 'react'
import Modal from 'react-modal'
import './AboutDlg.scss'

export default class AboutDlg extends React.Component {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor() {

    super()

  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  close () {

    this.props.close()
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  render() {

    const style = {
      overlay: {
        backgroundColor: 'rgba(201, 201, 201, 0.50)'
      }
    }

    return (
      <div>
        <Modal className="dialog about"
          contentLabel=""
          style={style}
          isOpen={this.props.open}
          onRequestClose={() => {this.close()}}>

          <div className="title">
            <img/>
            <b>About AEC Visual Reports ...</b>
          </div>

          <div className="content">
             <div>
               Written by Jaime Rosales
               <br/>
               <a href="https://twitter.com/afrojme" target="_blank">
               @AfroJme
               </a>
               &nbsp;- July 2017
               <br/>
               <br/>
               Source on github:
               <br/>
               <a href="https://github.com/Autodesk-Forge/aec-visual-reports" target="_blank">
               AEC Visual Reports
               </a>
             </div>
          </div>
        </Modal>
      </div>
    )
  }
}
