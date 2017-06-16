import { connect } from 'react-redux'
import CoreLayout from './CoreLayout'
import {
  setNavbarState,
  setUser,
  } from '../../store/app'

const mapDispatchToProps = {
  setNavbarState,
  setUser
}

const mapStateToProps = (state) => ({
  appState: state.app
})

export default connect(
  mapStateToProps,
  mapDispatchToProps)(CoreLayout)
