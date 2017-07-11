import ServiceManager from 'SvcManager'
import PropTypes from 'prop-types'
import 'react-reflex/styles.css'
import 'Dialogs/dialogs.scss'
import Header from 'Header'
import React from 'react'
import 'core.scss'

class CoreLayout extends React.Component {

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static propTypes = {
    children : PropTypes.element.isRequired
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  constructor () {

    super()

    this.state = {

    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  componentWillMount () {

    this.forgeSvc = ServiceManager.getService(
      'ForgeSvc')

    this.forgeSvc.getUser().then((user) => {

      this.props.setUser(user)
    })
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  render () {

    const { appState, children } = this.props

    return (
      <div className='container'>
        <Header {...this.props} />
        <div className='core-layout__viewport'>
          {children}
        </div>
      </div>
    )
  }
}

export default CoreLayout
