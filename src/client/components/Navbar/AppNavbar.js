
import { LinkContainer } from 'react-router-bootstrap'
import ServiceManager from 'SvcManager'
import PropTypes from 'prop-types'
import './AppNavbar.scss'
import React from 'react'
import {
  DropdownButton,
  NavDropdown,
  MenuItem,
  NavItem,
  Navbar,
  Button,
  Modal,
  Nav
  } from 'react-bootstrap'

export default class AppNavbar extends React.Component {

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  constructor (props) {

    super(props)

    this.state = {
      aboutOpen:    false,
      menuIcons:    false
    }

    this.forgeSvc = ServiceManager.getService(
      'ForgeSvc')

    console.log(this.props)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  openAboutDlg () {

    this.setState(Object.assign({}, this.state, {
      aboutOpen: true
    }))
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  login () {

    const { appState } = this.props

    if (appState.user) {

      this.props.setUser(null)

      this.forgeSvc.logout()

    } else {

      this.forgeSvc.login()
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  render() {

    const { appState } = this.props

    const {user} = appState

    const username = user
      ? `${user.firstName} ${user.lastName}`
      : ''

    return (

      <Navbar className="forge-rcdb-navbar">
        <Navbar.Header>
          <Navbar.Brand>
            <NavItem className="forge-rcdb-brand-item"
              href="https://forge.autodesk.com"
              target="_blank">
              <img height="30" src="/resources/img/forge-logo.png"/>
              {/*&nbsp;<b>Forge</b> | RCDB*/}
            </NavItem>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>

        <Navbar.Collapse>

          {
            appState.navbar.links.home &&

            <Nav>
              <LinkContainer to={{ pathname: '/', query: { } }}>
                <NavItem eventKey={1}>
                  <span className={"forge-rcdb-span " + (this.state.menuIcons ? "fa fa-home":"")}/>
                  <label className="nav-label">
                    &nbsp; Home
                  </label>
                </NavItem>
              </LinkContainer>
            </Nav>
          }

           {
             appState.navbar.links.gallery &&

             <Nav>
               <LinkContainer to={{ pathname: '/gallery', query: { } }}>
                 <NavItem eventKey={2}>
                   <span className={"forge-rcdb-span " + (this.state.menuIcons ? "fa fa-home":"")}/>
                   <label className="nav-label">
                   &nbsp; Gallery
                   </label>
                 </NavItem>
               </LinkContainer>
             </Nav>
           }

          <Nav pullRight>

            {

              appState.navbar.links.login &&

              <NavItem eventKey={3} onClick={() => {this.login()}}>
                {
                  !appState.user &&
                  <span className="forge-rcdb-span fa fa-user"/>
                }
                {
                  appState.user &&
                  <img className="avatar" src={appState.user.profileImages.sizeX80}/>
                }
                <label className="nav-label" style={{top: appState.user ? "2px" : "-2px"}}>
                &nbsp; { appState.user ? username : "Login"}
                </label>
              </NavItem>
            }

            {
              appState.navbar.links.about &&

              <NavItem eventKey={4} onClick={() => {this.openAboutDlg()}}>
                <span className={"forge-rcdb-span " + (this.state.menuIcons ? "fa fa-question-circle":"")}/>
                <label className="nav-label">
                &nbsp; About ...
                </label>
              </NavItem>
            }
          </Nav>

        </Navbar.Collapse>
      </Navbar>
    )
  }
}
