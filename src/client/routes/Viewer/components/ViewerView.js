import {ReflexContainer, ReflexElement, ReflexSplitter} from 'react-reflex'

import ContextMenuExtensionId from 'Viewing.Extension.ContextMenu'
import DualExtensionId from 'Viewing.Extension.DualViewer'
import PieExtensionId from 'Viewing.Extension.PieChart'
import BarExtensionId from 'Viewing.Extension.BarChart'

import WidgetContainer from 'WidgetContainer'
import { ReactLoader } from 'Loader'
import Toolkit from 'Viewer.Toolkit'
import Viewer from 'Viewer'
import './ViewerView.scss'
import React from 'react'

class ViewerView extends React.Component {

   /////////////////////////////////////////////////////////
   //
   //
   /////////////////////////////////////////////////////////
   constructor () {

      super ()

      this.onViewerCreated = this.onViewerCreated.bind(this)
     
      this.state = {
        dualExtension: null,
        barExtension: null,
        pieExtension: null
      }
   }

   componentWillMount() {
   
     this.props.setNavbarState({
      links: {
        login: true
      }
     })
   }

   /////////////////////////////////////////////////////////
   // Initialize viewer environment
   //
   /////////////////////////////////////////////////////////
   initialize (options) {

      return new Promise((resolve, reject) => {

        Autodesk.Viewing.Initializer (options, () => {

          resolve ()

        }, (error) => {

          reject (error)
        })
      })
   }

   /////////////////////////////////////////////////////////
   // Load a document from URN
   //
   /////////////////////////////////////////////////////////
   loadDocument (urn) {

      return new Promise((resolve, reject) => {

        const paramUrn = !urn.startsWith('urn:')
          ? 'urn:' + urn
          : urn

        Autodesk.Viewing.Document.load(paramUrn, (doc) => {

          resolve (doc)

        }, (error) => {

          reject (error)
        })
      })
   }

   /////////////////////////////////////////////////////////
   // Return viewable path: first 3d or 2d item by default
   //
   /////////////////////////////////////////////////////////
   getViewablePath (doc, pathIdx = 0, roles = ['3d', '2d']) {

      const rootItem = doc.getRootItem()

      const roleArray = [...roles]

      let items = []

      roleArray.forEach((role) => {

        items = [ ...items,
          ...Autodesk.Viewing.Document.getSubItemsWithProperties(
            rootItem, { type: 'geometry', role }, true) ]
      })

      if (!items.length || pathIdx > items.length) {

        return null
      }

      return doc.getViewablePath(items[pathIdx])
   }


   assignState (state) {

    return new Promise((resolve) => {

      const newState = Object.assign({}, this.state, state)

      this.setState(newState, () => {
        resolve()
      })
    })
   }

   /////////////////////////////////////////////////////////
   // viewer div and component created
   //
   /////////////////////////////////////////////////////////
   async onViewerCreated (viewer) {

      try {

        let doc = null

        let modelOptions = null

        let { id, urn, path, pathIdx } = this.props.location.query

        // check if env is initialized
        // initializer cannot be invoked more than once

        if (!this.props.appState.viewerEnv) {

          await this.initialize({
            env: 'AutodeskProduction',
            useConsolidation: true
          })

          this.props.setViewerEnv('AutodeskProduction')

          Autodesk.Viewing.setEndpointAndApi(
            window.location.origin + '/lmv-proxy-2legged',
            'modelDerivativeV2')

          Autodesk.Viewing.Private.memoryOptimizedSvfLoading = true

          //Autodesk.Viewing.Private.logger.setLevel(0)
        }

        if (id) {

          // load by database id lookup
          // !NOT IMPLEMENTED HERE
          // could be something like:
          // const dbModel = getDBModelBy(id)
          // urn = dbModel.urn

        } else if (urn) {

          doc = await this.loadDocument (urn)

          path = this.getViewablePath (doc, pathIdx || 0)

          modelOptions = {
            sharedPropertyDbPath: doc.getPropertyDbPath()
          }

        } else if (!path) {

          const error = 'Invalid query parameter: ' +
            'use id OR urn OR path in url'

          throw new Error(error)
        }

        viewer.start()

        const extOptions = (id) => {

          return {
            react: {

              pushRenderExtension: () => {},

              pushViewerPanel: () => {},

              popRenderExtension: () => {},

              popViewerPanel: () => {},

              forceUpdate: () => {

                return new Promise ((resolve) => {
                  this.forceUpdate(() => {
                    resolve()
                  })
                })
              },
              getComponent: () => {

                return this
              },
              getState: () => {

                return this.state[id] || {}
              },
              setState: (state, merge) => {

                return new Promise ((resolve) => {

                  const extState = this.state[id] || {}

                  var newExtState = {}

                  newExtState[id] = merge
                    ? _.merge({}, extState, state)
                    : Object.assign({}, extState, state)

                  this.assignState(newExtState).then(() => {

                    resolve (newExtState)
                  })
                })
              }
            }
          }
        }


        viewer.loadExtension(DualExtensionId, 
          Object.assign({}, extOptions(DualExtensionId), {
            viewerDocument: doc
          })).then((dualExtension) => {
            this.assignState({
              dualExtension
            })
        })

        viewer.loadExtension(BarExtensionId, 
          Object.assign({}, extOptions(BarExtensionId), {
            defaultIndex: 60 // Category
          }
          )).then((barExtension) => {
            this.assignState({
              barExtension
            })
          })

        viewer.loadExtension(PieExtensionId, 
          Object.assign({}, extOptions(PieExtensionId), {
            defaultIndex: 534 // System Type
          }
          )).then((pieExtension) => {
            this.assignState({
              pieExtension
            })
          })

        viewer.loadExtension(
          ContextMenuExtensionId, {
            buildMenu: (menu, selectedDbId) => {
              return !selectedDbId
                ? [{
                title: 'Show all objects',
                target: () => {
                  Toolkit.isolateFull(this.viewer)
                  this.viewer.fitToView()
                }}]
                : menu
            }
          })

        viewer.loadModel(path,modelOptions)

      } catch (ex) {

        console.log('Viewer Initialization Error: ')
        console.log(ex)
      }
   }

  
   /////////////////////////////////////////////////////////
   //
   //
   /////////////////////////////////////////////////////////
   render() {

        const {dualExtension} = this.state
        const {pieExtension}  = this.state
        const {barExtension}  = this.state

        return (

          <div className="viewer-view">
            <ReflexContainer orientation='vertical'>
              <ReflexElement>
              <ReflexContainer orientation='horizontal'>
              <ReflexSplitter/>
                <ReflexElement flex={0.5} propagateDimensions={true} minSize={150}>
                 <WidgetContainer title="3D Model">
                   <Viewer onViewerCreated={this.onViewerCreated}/>
                 </WidgetContainer>
                
                </ReflexElement>
              <ReflexSplitter/>
                <ReflexElement minSize={39} onResizeRate={100} onResize={() => dualExtension.onResize()}>
                      <ReactLoader show={!dualExtension}/>
                      {dualExtension && dualExtension.render()}
                    </ReflexElement>
                </ReflexContainer>    
              </ReflexElement>


            <ReflexSplitter onStopResize={() => barExtension.onStopResize()}/>
              <ReflexElement>
                <ReflexContainer orientation='horizontal'>
                 <ReflexSplitter/>
                  <ReflexElement minSize={39} onStopResize={() => pieExtension.onStopResize()}>
                      <ReactLoader show={!pieExtension}/>
                      {pieExtension && pieExtension.render()}
                  </ReflexElement>
                  <ReflexSplitter/>
                  <ReflexElement minSize={39} onStopResize={() => barExtension.onStopResize()}>
                      <ReactLoader show={!barExtension}/>
                      {barExtension && barExtension.render()}
                  </ReflexElement>
                </ReflexContainer>
              </ReflexElement>
            </ReflexContainer>
          </div>
        )
  }
}

export default ViewerView

/*

               <ReflexElement minSize={139}>
                 <WidgetContainer title="BIM 360 Docs">
                 </WidgetContainer>
               </ReflexElement>
               <ReflexSplitter onStopResize={() => this.forceUpdate()}/>
*/