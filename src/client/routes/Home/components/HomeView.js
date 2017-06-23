import { IndexLink, Link } from 'react-router'
import React from 'react'
import './HomeView.scss'

class HomeView extends React.Component {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor() {

    super()

    this.state = {
      models: [
        {
          thumbnail: 'resources/img/Office.png',
          urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6amFpbWV2aXN1YWxyZXBzYmltMzYwZG9jczFnc2Jtb3NlYnp4a2cyY3RhNW0wZWtsMDNubXN6dzF0L1VyYmFuSG91c2UtMjAxNS5ydnQ',
          thumbnailClass: 'office',
          name: 'Office'
        },
        // {
        //   //path: 'resources/models/seat/seat.svf',
        //   urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWVjbW9kZWxzLXZpc3VhbHJlcG9ydHMxZ3NibW9zZWJ6eGtnMmN0YTVtMGVrbDAzbm1zencxdC9yYWNfYWR2YW5jZWRfc2FtcGxlX3Byb2plY3QucnZ0',
        //   thumbnailClass: 'office-thumbnail',
        //   name: 'RAC Advanced'
        // },
        // {
        //   //path: 'resources/models/seat/seat.svf',
        //   urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWVjbW9kZWxzLXZpc3VhbHJlcG9ydHMxZ3NibW9zZWJ6eGtnMmN0YTVtMGVrbDAzbm1zencxdC9ybWVfYWR2YW5jZWRfc2FtcGxlX3Byb2plY3QucnZ0',
        //   thumbnailClass: 'office-thumbnail',
        //   name: 'RME Advanced'
        // },
        {
          thumbnail: 'resources/img/RST-advanced.png',
          urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWVjbW9kZWxzLXZpc3VhbHJlcG9ydHMxZ3NibW9zZWJ6eGtnMmN0YTVtMGVrbDAzbm1zencxdC9yc3RfYWR2YW5jZWRfc2FtcGxlX3Byb2plY3QucnZ0',
          thumbnailClass: 'office-thumbnail',
          name: 'RST Advanced'
        },
        {
          thumbnail: 'resources/img/RME-simple.png',
          urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWVjbW9kZWxzLXZpc3VhbHJlcG9ydHMxZ3NibW9zZWJ6eGtnMmN0YTVtMGVrbDAzbm1zencxdC9ybWVfYmFzaWNfc2FtcGxlX3Byb2plY3QucnZ0',
          thumbnailClass: 'office-thumbnail',
          name: 'RME Simple'
        }
      ]
    }
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  render() {

    return (
      <div className="home">
        <img className='logo-hero'/>
        <div className="models">
          <div className="title">
            Choose Model
          </div>
          <div className="content responsive-grid">
            {
              this.state.models.map((model, idx) => {
                return (
                  <Link key={idx} to={`/viewer?urn=${model.urn}`}>
                    <figure>
                      <figcaption>
                        {model.name}
                      </figcaption>
                      <img className={model.thumbnailClass || 'default-thumbnail'}
                        src={model.thumbnail || ''}/>
                    </figure>
                  </Link>)
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default HomeView